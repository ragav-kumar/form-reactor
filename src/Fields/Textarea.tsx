import React from 'react'
import { useField, useFormikContext } from 'formik';
import styled from 'styled-components';
import { inputStyle } from '../common/styles';

interface InnerProps {
	isRounded?:boolean;
	isError?: boolean;
	fullWidth?: boolean;
	rows?: number;
}
const TextareaField = styled.textarea<InnerProps>` &&& {
	${props => inputStyle(!!props.isError, !!props.isRounded)}
	width: ${({fullWidth}) => fullWidth ? "100%" : "auto"};
	height: ${({rows}) => rows ? rows + "em" : "auto"};
}`;

interface TextareaProps {
	name: string;
	rows?: number;
	[x:string]:any;
}

export const Textarea = (props:TextareaProps) => {
	const { submitCount } = useFormikContext();
	const [field, meta] = useField<string>(props);
	return (
		<TextareaField
			{...field}
			isError={!!meta.error && meta.touched && submitCount > 0}
			{...props}
		/>
	);
}