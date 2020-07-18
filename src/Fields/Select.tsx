import React from 'react'
import ReactSelect from "react-select";
import { ValueType } from 'react-select/src/types'
import { useFormikContext, useField } from 'formik';


export interface SelectItem {
	value: number|string;
	label: string;
}
interface SelectProps {
	name      : string;
	options   : SelectItem[];
	[x:string]: any;
}
interface PlainSelectProps extends SelectProps {
	value: number|string;
	onChange: (option: number|string) => void;
}
export const PlainSelect = ({name, value, options, onChange}:PlainSelectProps) => {
	const handleChange = (option:ValueType<SelectItem>) => {
		// Do a little dance because of the arcane way ValueType is defined
		if (!option) {
			return;
		} if ('length' in option) {
			if (option.length > 0) {}
			return;
		} else {
			onChange(option ? option.value : "");
		}
	};
	return (
		<ReactSelect<SelectItem>
				name={name}
				options={options}
				value={options.length ? options.find(o => o.value == value) : {value:"", label:""}}
				onChange={handleChange}
				isClearable={false}
		/>
	);
}
export const Select = ({name, options, onChange, ...props}:SelectProps) => {
	const { submitCount } = useFormikContext();
	const [field, meta, helpers] = useField<number|string>({name, ...props});
	const handleChange = (option:ValueType<SelectItem>) => {
		// Do a little dance because of the arcane way ValueType is defined
		if (!option) {
			return;
		} if ('length' in option) {
			if (option.length > 0) {}
			return;
		} else {
			helpers.setValue(option ? option.value : "");
		}
	}
	return (
		<ReactSelect<SelectItem>
			name={name}
			options={options}
			value={options ? options.find(o => o.value == field.value) : {value:"", label:""}}
			onBlur={field.onBlur}
			onChange={handleChange}
			placeholder={props.placeholder || "Select"}
		/>
	);
}