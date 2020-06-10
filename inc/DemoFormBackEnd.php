<?php

namespace FormReactor;

use FormReactor;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class DemoFormBackEnd {
	function __construct() {
		add_action('rest_api_init', [$this, 'defineRestEndpoints']);
		add_action('wp_enqueue_scripts', [$this, 'enqueue']);

		add_shortcode('form-reactor-demo-form', [$this, 'shortcode']);
	}
	function enqueue() {
		// Register any styles or scripts specific to this particular app
		// We won't actually enqueue them until needed
		// Include the dummy script as a dependency to ensure the globals are available
		wp_register_script(
			'form-reactor-demoform',
			FormReactor::reactSrc('demoform'),
			['react', 'form-reactor-dummy-script'],
			'1.0'
		);
		// Also use this opportunity to localize this script as needed
	}
	function shortcode($atts):string {
		$atts = shortcode_atts([], $atts);

		// Now that we know we need the js, we can actually enqueue it
		wp_enqueue_script('form-reactor-demoform');

		ob_start();
		?>
		<div id="form-reactor-demo-form"></div>
		<?php
		return ob_get_clean();
	}
	function defineRestEndpoints() {
		// Put any calls to register_rest_route() in here
	}
}