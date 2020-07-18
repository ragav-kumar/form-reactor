<?php
/*
Plugin Name: Form Reactor
Description: Skeleton for a React-based Form Plugin
Version: 1.0
Author: Ragav Kumar
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

add_action('init', ['FormReactor', 'init'], 0);

/**
 * Initial entrypoint into the plugin. Also preps any common data (REST API stuff,
 * modal root, etc)
 */
class FormReactor {
	public const REST_BASE       = "formreactor/v1";
	public const BASE_NAMESPACE  = "FormReactor";
	public const COMMON_DATA_VAR = "formReactorData";
	public const MODAL_ROOT      = "form-reactor-modal-root-node";
	
	private static ?self $instance = null;

	public static string $dir;
	public static string $url;

	public static function init():self {
		if (!isset(self::$instance)) {
			self::$instance = new self();
		}
		return self::$instance;
		
	}
	private function __construct() {
		self::$dir = plugin_dir_path(__FILE__);
		self::$url = plugin_dir_url(__FILE__);

		spl_autoload_register([$this, 'autoloader']);

		$this->loadApps();
		// Insert any needed hooks here
		add_action('wp_enqueue_scripts', [$this, 'enqueue']);
		add_action('admin_enqueue_scripts', [$this, 'enqueue']);
		// Creates an out-of-app node for modals
		add_action('wp_footer', [$this, 'modalRenderNode']);
		add_action('admin_footer', [$this, 'modalRenderNode']);
	}
	/**
	 * Load in all classes in inc/Backend.
	 * These classes should have a one-to-one correspondence with applications,
	 * Serving as their backends
	 *
	 * @return void
	 */
	private function loadApps() {
		$glob = glob(
			self::$dir . 'inc' . DIRECTORY_SEPARATOR .
			'Backend' . DIRECTORY_SEPARATOR ."*.php"
		);
		foreach ($glob as $file) {
			$class = basename($file, '.php');
			// Add Namespace prefix
			$class = "\\" . self::BASE_NAMESPACE . "\\Backend\\" . $class;
			if (class_exists($class)) {
				new $class();
			}
		}
	}
	/**
	 * Load in Styles and script for use in application
	 *
	 * @return void
	 */
	function enqueue() {
		// Load in a dummy script, and inject common variables through it
		wp_register_script('form-reactor-dummy-script', "");
		wp_enqueue_script('form-reactor-dummy-script');
		wp_add_inline_script(
			'form-reactor-dummy-script',
			"window." . self::COMMON_DATA_VAR . "=" . json_encode([
				'imgUrl'     => self::$url . "img/",
				'apiUrl'     => self::REST_BASE . "/",
				'fullApiUrl' => rest_url(self::REST_BASE),
				'apiNonce'   => wp_create_nonce('wp_rest'),
				'user'       => get_current_user_id(),
				'modalRoot'  => self::MODAL_ROOT,
			])
		);
	}
	/**
	 * Creates a div outside the React application, which is needed for Modals
	 *
	 * @return void
	 */
	function modalRenderNode() {
		?>
		<div id="<?= self::MODAL_ROOT ?>"></div>
		<?php
	}
	/**
	 * Plugin Autoloader
	 *
	 * @param string $class
	 * @return void
	 */
	public function autoloader($class) {
		// does the class use the namespace prefix?
		$len = strlen(self::BASE_NAMESPACE);
		if (strncmp(self::BASE_NAMESPACE, $class, $len) !== 0) {
			return; // No
		}
		$relativeClassName = substr($class, $len);
		// Perform substitutions
		$file = $this->dir . 'inc' . DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $relativeClassName) . '.php';

		if (file_exists($file)) {
			require($file);
		}
	}
}

