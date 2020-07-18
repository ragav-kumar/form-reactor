import React from 'react'
import { useFormikContext } from 'formik';
import styled from 'styled-components';

const Wrap = styled.div` &&& {
	font-family: 'Roboto', sans-serif;
	font-size: 16px;
	font-weight: 500;
	color: red;
	line-height: 2em;
	margin-top: 2em;
	text-align: center;
}`;

export const ErrorSummary = <T extends unknown>() => {
	const {errors, submitCount} = useFormikContext<T>();
	if (!errors || submitCount == 0) {
		return null;
	}
	const errorMessages:string[] = getMessages(errors);
	const items = errorMessages.map(msg => (<div>{msg}</div>));
	return (
		<Wrap>{items}</Wrap>
	);
}
interface ErrorObject {
	[x:string]: any;
}
const getMessages = (errors:ErrorObject):string[] => {
	var messages:string[] = [];
	for (const key in errors) {
		if (errors.hasOwnProperty(key)) {
			const error = errors[key];
			if (typeof error === 'string') {
				messages.push(error);
			} else if (Array.isArray(error)) {
				messages.concat(error);
			} else if (typeof error === 'object') {
				messages = [...messages,...getMessages(error)];
			} else {
				messages.push("Unidentified error");
			}
		}
	}
	return messages;
}