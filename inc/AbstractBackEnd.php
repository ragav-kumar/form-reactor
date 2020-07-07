<?php

namespace FormReactor;

use FormReactor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

abstract class AbstractBackEnd {
	/** @var string */
	private $handle;
	/** @var string */
	private $entry;
	/** @var string|null */
	private $version;

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
	/**
	 * Helper to enqueue Entrypoint
	 * @param string $handle 
	 * @param string $name 
	 * @param string $version Specify version
	 * @return void 
	 * @throws InvalidArgumentException 
	 */
	protected function enqueueEntrypoint(string $handle, string $name, string $version=null) {
		$path = FormReactor::$dir . "js/$name.js";
		if (file_exists($path)) {
			$path = FormReactor::$url . "js/$name.js";
		} else {
			throw new \InvalidArgumentException("Missing Source file: $name.js");
		}
		wp_register_script( $handle, $path, ['wp-element', 'wp-api-fetch'], $version ?? time());
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