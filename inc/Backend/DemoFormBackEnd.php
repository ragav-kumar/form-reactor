<?php

namespace FormReactor\Backend;

use FormReactor;
use FormReactor\AbstractBackEnd;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class DemoFormBackEnd extends AbstractBackEnd {
	public const SHORTCODE = 'form-reactor-demo-form';
	public const SCRIPT_HANDLE = "form_reactor_demoform";
	public const ENTRY_POINT = 'demoform';
	public const NODE_ID = "form-reactor-demo-form";

	function __construct() {
		// During testing, Don't specify version. This will prevent caching.
		parent::__construct(self::SHORTCODE, self::SCRIPT_HANDLE, self::ENTRY_POINT);
	}
	function shortcode($atts):string {
		$atts = shortcode_atts([
			// Define all shortcode attributes here
		], $atts);

		// Instance-specific localization happens here. This is any form-specific
		// data that must be passed along. Notice the object name, it must be unique.
		wp_add_inline_script(self::SCRIPT_HANDLE, "window.formReactorDemoFormData=" . json_encode([
			// Whatever vars need to be passed along
		]), 'before');
		// Now that we know we need the js, we can actually enqueue it
		wp_enqueue_script(self::SCRIPT_HANDLE);
		return $this->jsRootNode(self::NODE_ID, false);
	}
	function defineRestEndpoints() {
		// Put any calls to register_rest_route() in here
	}
}