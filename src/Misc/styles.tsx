import styled, { css } from 'styled-components'

export const viewport = {
	desktop   : `(min-width:981px)`,
	notDesktop: `(max-width:980px)`,
	tablet    : `(min-width:601px and max-width:980px)`,
	notTablet : `(max-width:600px and min-width:981px)`,
	phone     : `(max-width:600px)`,
	notPhone  : `(min-width:601px)`,
}

export const overlay = css`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`;

export const parallelogramBorder = (color:string, onBackground:boolean) => css`
	position: relative;
	&:before {
		content: "";
		display: block;
		${overlay}
		background-color:${onBackground ? color : "transparent"};
		z-index: -1;
		border: ${onBackground ? "none" : "1px solid " + color};
		transform: skewX(-10deg);
	}
`;

export const buttonStyling = css``;
export const inputStyling = (isError:boolean, isRounded:boolean) => css`
	font-size: 16px;
	padding: .3em .5em;
	color: black;
	background-color: white;
	border-radius: ${isRounded ? "5px" : "0px"};
	border-color: ${isError ? "red" : "#767676"};
	&:disabled {
		background-color: #f2f2f2;
		border-color: #e6e6e6;
	}
`;