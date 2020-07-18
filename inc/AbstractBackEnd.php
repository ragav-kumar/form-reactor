<?php

namespace FormReactor;

use FormReactor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/**
 * All Backends should inherit from this class. Note that a backend should
 * be in FormReactor\Backend namespace in order to be autoloaded
 */
abstract class AbstractBackEnd {
	/** @var string $handle */
	private $handle;
	/** @var string $entry */
	private $entry;
	/** @var string|null $version */
	private $version;

	/**
	 * Sets up hooks that most forms would need, and takes care of enqueuing JS.
	 * Note that while $shortcode, $handle, and $entry have default values
	 * in order to be compatible with parameter-less constructors in child classes,
	 * they must be specified when parent::__construct() is called.
	 * @param string $shortcode Shortcode name (for use in WP admin view, for ex)
	 * @param string $handle Script handle.
	 * @param string $entry Filename (no extension) of compiled entrypoint
	 * @param string|null $version Version Number. If left null, will use time(), for cache busting purposes during development
	 * @return void 
	 * @throws \BadMethodCallException If $shortcode, $handle, or $entry are not specified.
	 */
	function __construct(string $shortcode=null, string $handle=null, string $entry=null, string $version=null) {
		if (!$shortcode || !$handle || !$entry) {
			throw new \BadMethodCallException("Must specify Shortcode, Script handle, and entrypoint");
		}
		$this->handle = $handle;
		$this->entry = $entry;
		$this->version = $version;
		add_action("rest_api_init", [$this, "defineRestEndpoints"]);
		add_action("wp_enqueue_scripts", [$this, 'enqueue']);
		add_shortcode($shortcode, [$this, 'shortcode']);
	}
	//--------------------------------------------------------------------------
	/**
	 * Enqueue the any scripts or styles needed for this app, including the 
	 * core react source file
	 */
	function enqueue() {
		$path = FormReactor::$dir . "js/{$this->entry}.js";
		if (file_exists($path)) {
			$path = FormReactor::$url . "js/{$this->entry}.js";
		} else {
			throw new \InvalidArgumentException("Missing Source file: {$this->entry}.js");
		}
		wp_register_script(
			$this->handle,
			$path,
			['wp-element', 'wp-api-fetch'],
			$this->version ?? time()
		);
	}
	//--------------------------------------------------------------------------
	/**
	 * Analogous to wp_send_json_success()
	 * @param mixed $data Typically an associative array, but that's not required
	 * @return array [success: true, data: mixed]
	 */
	protected function success($data):array {
		return [
			'success' => true,
			'data' => $data,
		];
	}
	//--------------------------------------------------------------------------
	/**
	 * Generate a failure response. Kinda like wp_send_json_error()
	 * @param string $msg 
	 * @return array [success: false, error: string]
	 */
	protected function failure(string $msg):array {
		return [
			'success' => false,
			'error' => $msg,
		];
	}
	//--------------------------------------------------------------------------
	protected function jsRootNode(string $id, bool $useClass = false):string {
		$type = $useClass ? "class" : "id";
		return "<div {$type}=\"{$id}\">Loading...</div>";
	}
	//--------------------------------------------------------------------------
	/**
	 * Create a global variable that will hold instance-specific data.
	 * This method will also enqueue the script, so call only if script
	 * will be needed.
	 * @param string $handle Script handle
	 * @param string $varName Instance variable name. Should be unique
	 * @param array $data Any data to be passed to react app
	 * @return void 
	 */
	protected function loadScript(string $handle, string $varName, array $data) {
		wp_add_inline_script(
			$handle,
			"window.{$varName}=" . json_encode($data),
			'before'
		);
		// Now that we know we need the js, we can actually enqueue it
		wp_enqueue_script($handle);
	}
	//--------------------------------------------------------------------------
	/**
	 * Holds all calls to register_rest_route()
	 */
	abstract function defineRestEndpoints();
	/**
	 * Use a shortcode to generate the root div of the application.
	 * Should later make a block version of this!
	 *
	 * @param string|array $atts
	 * @return string HTML output of the root node
	 */
	abstract function shortcode($atts):string;
}