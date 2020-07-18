import React from 'react'
import styled from 'styled-components'
import { useField } from 'formik'
import ReactDatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const FieldWrap = styled.div` &&& {
	.react-datepicker-wrapper {
		width: 100%;
	}
	input {
		padding: 6px 10px;
		border-radius: 5px;
		width: 100%;
	}
}`;
interface DatePickerProps {
	name: string;
	type: "date"|"time"|"full"
	[x:string]:any;
}
export const DatePicker = (props:DatePickerProps) => {
	const [ field, , helpers ] = useField<string>(props);
	const parse = (val:Date|null):string => {
		if (!val) {
			return "" ;
		}
		switch (props.type) {
			case 'date':
				return val.toDateString();
			case 'time':
				return val.toTimeString();
			case 'full':
				return val.toISOString();
		}
	}
	return (
		<FieldWrap>
			<ReactDatePicker
				{...props}
				value={field.value}
				selected={(field.value && new Date(field.value)) || null}
				onChange={val => helpers.setValue(parse(val))}
				onBlur={field.onBlur}
			/>
		</FieldWrap>
	);
};