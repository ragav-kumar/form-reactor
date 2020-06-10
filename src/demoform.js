/* global window, document */
if (! window._babelPolyfill) {
	require('@babel/polyfill');
}

import React from 'react';
import ReactDOM from 'react-dom';
import { DemoForm } from "./DemoForm/DemoForm";

document.addEventListener('DOMContentLoaded', function() {
	ReactDOM.render(
		<DemoForm formReactor={window.formReactorData} />,
		document.getElementById('form-reactor-demo-form')
	);
});
