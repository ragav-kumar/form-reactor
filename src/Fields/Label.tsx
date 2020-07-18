import React from 'react'
import styled from 'styled-components'
import { viewport } from '../Misc/styles';

interface LabelProps {
	label ?: string;
	as ?: "label"|"div"|"span";
	children: React.ReactNode;
}
interface LabelWrapProps {
	as ?: "label"|"div"|"span";
}
const LabelWrap = styled.label<LabelWrapProps>` &&& {
	margin: 5px 0;
	display: block;
	font-size: 18px;
	width: auto;
}`;
const LeftLabelWrap = styled.label<LabelWrapProps>` &&& {
	display: grid;
	grid-template-columns: 1fr;
	@media ${viewport.desktop} {
		grid-template-columns: minmax(200px, 1fr) 2fr;
	}
	align-items: center;
	margin: 10px 0;
	font-size: 18px;
}`;

const LabelText = styled.span` &&& {
	display: block;
	font-size: 20px;
	color: black;
}`;
export const TopLabel = (props:LabelProps) => (
	<LabelWrap as={props.as} >
		<LabelText>{props.label}</LabelText>
		{props.children}
	</LabelWrap>
);
export const LeftLabel = (props:LabelProps) => (
	<LeftLabelWrap as={props.as} >
		<LabelText>{props.label}</LabelText>
		{props.children}
	</LeftLabelWrap>
);