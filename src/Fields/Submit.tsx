import React from 'react'
import { useFormikContext } from 'formik';
import { Button } from './Button';
import styled from 'styled-components';
import { buttonStyling } from '../Misc/styles';

interface SubmitProps {
	name: string;
	[x:string]: any;
}
/**
 * Basic Submit button for when no special behaviour is needed.
 */
export const SubmitButton = styled.input.attrs<SubmitProps>(props => ({
	type: "submit",
	...props
}))` &&& {
	${buttonStyling}
}`;


interface MultiSubmitProps extends SubmitProps {
	action: string;
}
interface FormState {
	action: string;
	[x:string]: any;
}
/**
 * Submit button capable of multi-submit via the "action" prop.
 * The action prop is updated in values, so that better be included
 */
export const MultiSubmitButton = ({action, ...props}:MultiSubmitProps) => {
	const { setFieldValue } = useFormikContext<FormState>();

	return (
		<Button
			type="submit"
			onClick={() => setFieldValue("action", action)}
			{...props}
		/>
	);
}