<?php

namespace FormReactor\Backend;

use FormReactor\AbstractBackEnd;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class DemoFormBackEnd extends AbstractBackEnd {
	public const SHORTCODE     = "form-reactor-demo-form";
	public const SCRIPT_HANDLE = "form_reactor_demoform";
	public const ENTRY_POINT   = "demoform";
	public const NODE_ID       = "form-reactor-demo-form";
	public const INSTANCE_VAR  = "formReactorDemoFormData";

	function __construct() {
		// During testing, Don't specify version. This will prevent caching.
		parent::__construct(self::SHORTCODE, self::SCRIPT_HANDLE, self::ENTRY_POINT);
	}
	//--------------------------------------------------------------------------
	function shortcode($atts):string {
		$atts = shortcode_atts([
			// Define all shortcode attributes here
		], $atts);

		// load in our JS file
		$this->loadScript(self::SCRIPT_HANDLE, self::INSTANCE_VAR, [
			// Whatever vars need to be passed along
		]);
		
		return $this->jsRootNode(self::NODE_ID, false);
	}
	//--------------------------------------------------------------------------
	function defineRestEndpoints() {
		// Put any calls to register_rest_route() in here
	}
	//--------------------------------------------------------------------------
}