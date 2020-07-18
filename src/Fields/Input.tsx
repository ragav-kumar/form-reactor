import React from 'react'
import { useField, useFormikContext } from 'formik';
import NumberFormat, { NumberFormatValues } from 'react-number-format'
import styled from 'styled-components';
import { inputStyling } from '../Misc/styles';

interface InputProps {
	isRounded?:boolean;
	isError?: boolean;
	fullWidth?: boolean;
}
const Input = styled.input<InputProps>` &&& {
	${props => inputStyling(!!props.isError, !!props.isRounded)}
	width: ${({fullWidth}) => fullWidth ? "100%" : "auto"};
}`;

interface TextProps {
	name: string;
	fullWidth ?: boolean;
	[x:string]: any; // Others
}
/**
 * Your basic Text input field.
 */
export const TextInput = ({...props}:TextProps) => {
	const { submitCount } = useFormikContext();
	const [field, meta] = useField<string>(props);
	return (
		<Input
			{...field}
			isError={!!meta.error && meta.touched && submitCount > 0}
			{...props}
		/>
	);
}

const StyledNumberFormat = styled(NumberFormat)<InputProps>` &&& {
	${props => inputStyling(!!props.isError, !!props.isRounded)}
}`
export const CurrencyInput = (props:TextProps) => {
	const { submitCount } = useFormikContext();
	const [field, meta, helpers] = useField(props);
	const valueChange = (values:NumberFormatValues) =>
		helpers.setValue(values.floatValue);
	
	return (
		<StyledNumberFormat
			name={field.name}
			thousandSeparator={true}
			prefix='$'
			value={field.value}
			onValueChange={valueChange}
			onBlur={field.onBlur}
			allowEmptyFormatting
			allowNegative={false}
			allowLeadingZeros={false}
			decimalScale={0}
			isError={!!meta.error && submitCount > 0}
		/>
	);
};

/**
 * Your basic number input field
 */
export const NumberInput = ({name, ...props}:TextProps) => {
	const { submitCount } = useFormikContext();
	const [field, meta, helpers] = useField(name);
	const valueChange = (values:NumberFormatValues) => helpers.setValue(values.floatValue);
	
	return (
		<StyledNumberFormat
			name={name}
			thousandSeparator={false}
			value={field.value}
			onValueChange={valueChange}
			onBlur={field.onBlur}
			allowEmptyFormatting
			allowNegative={false}
			allowLeadingZeros={false}
			decimalScale={0}
			isError={!!meta.error && submitCount > 0}
			type="tel"
			{...props}
		/>
	);
};