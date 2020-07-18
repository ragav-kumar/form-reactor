import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { WPContext } from '../Misc/wpData';

export const ModalContext = React.createContext({
	onHide: () => {},
});

interface BackgroundProps { show: boolean }
/** Black full screen background */
const Background = styled.div<BackgroundProps>` &&& {
	display: ${({ show }) => show ? "block" : "none"};
	position: fixed;
	top: 0; bottom: 0; left: 0; right: 0;
	z-index: 1050;
	outline: 0;
	transition: opacity .15s linear;
	overflow-x: hidden;
	overflow-y: auto;
	background-color: rgba(0,0,0,0.7);
}`;
const Window = styled.div` &&& {
	max-height: none;
	overflow: hidden;
	position: relative;
	display: flex;
	flex-direction: column;
	pointer-events: auto;
	background-color: #fff;
	background-clip: padding-box;
	border: 1px solid rgba(0,0,0,.2);
	border-radius: .3rem;
	outline: 0;
	width: 100%;
	margin: 50px auto;
	max-width: 90vw;
	@media (min-width: 992px) {
		max-width: 800px;
	}
}`;
export interface ModalProps {
	show: boolean;
	onHide: () => void;
	children: React.ReactNode;
}
/**
 * Renders a modal popup
 */
export const Modal = ({ show, onHide, children }:ModalProps) => {
	const wpData = React.useContext(WPContext);
	const node = document.getElementById(wpData.modalRoot);
	if (!node) {
		console.log("Error: Modal Root node not found!", wpData);
		return null;
	}
	return ReactDOM.createPortal((
		<ModalContext.Provider value={{onHide: onHide}}>
			<Background show={show} onClick={onHide}>
				<Window onClick={e => e.stopPropagation()}>
					{children}
				</Window>
			</Background>
		</ModalContext.Provider>
	), node);
}

/** Renders Title for modal box */
export const Title = styled.h4` &&& {
	margin-bottom: 0;
	line-height: 1.5;
	font-size: 30px;
	font-weight: bold;
}`;
interface HeaderProps {
	children?: React.ReactNode
}
/**
 * Renders the header bar of the modal, including a FontAwesome "Close" button
 */
export const Header = ({children}:HeaderProps) => (
	<HeaderDiv>
		<HeaderChildren>{children}</HeaderChildren>
		<HeaderCloseButton />
	</HeaderDiv>
);
export const HeaderCloseButton = () => (
	<ModalContext.Consumer>
		{({onHide}) => (
			<FontAwesomeWrap>
				<FontAwesomeIcon
					icon={faTimes}
					onClick={onHide}
					color="#888"
					fontSizeAdjust="30px"
				/>
			</FontAwesomeWrap>
		)}
	</ModalContext.Consumer>
);

const HeaderDiv = styled.div` &&& {
	border-bottom: 1px solid #dee2e6;
	border-top-left-radius: .3rem;
	border-top-right-radius: .3rem;
	display: grid;
	grid-template-columns: 1fr 65px;
}`;
const HeaderChildren = styled.div` &&& {
	padding: 1rem;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-shrink: 0;
	float: left;
}`;
const FontAwesomeWrap = styled.div` &&& {
	border: 1px solid #dee2e6;
	display: flex;
	align-items: center;
	justify-content: center;
}`;
/** Body area of modal box */
export const Body = styled.div` &&& {
	position: relative;
	flex: 1 1 auto;
	padding: 1rem;
	overflow-y: auto;
}`;