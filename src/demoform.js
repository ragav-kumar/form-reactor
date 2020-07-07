
import React from 'react';
import ReactDOM from 'react-dom';
import { DemoForm } from "./DemoForm/DemoForm";

document.addEventListener('DOMContentLoaded', function() {
	ReactDOM.render(
		<DemoForm
			wp={window.formReactorData} // Common to all
			instance={window.formReactorDemoFormData} // Specific to this entrypoint
		/>,
		document.getElementById('form-reactor-demo-form')
	);
});
