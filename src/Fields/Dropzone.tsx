import React, {useState} from 'react'
import styled from 'styled-components'
import {useDropzone} from 'react-dropzone'
import { useField } from 'formik';

const Wrap = styled.div` &&& {
	background-color: grey;
	color: white;
	padding: 3px;
	border-radius: 10px;
	border-color: white;
	> div {
		border-width: 3px;
		border-style: dashed;
		border-radius: 10px;
		font-size: 16px;
		min-height: 4em;
		padding: 1em;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	&:hover {
		background-color: lightgray;
		color: black;
		border-color: black;
	}
}`;

const DropArea = ({children}:{children:React.ReactNode}) => (
	<Wrap>
		<div>
			<div>
				{children}
			</div>
		</div>
	</Wrap>
)
interface DropzoneProps {
	name: string;
	text: string;
	accept: string;
	[x:string]: any;
}
export const Dropzone = ({ name, text, accept, ...props }:DropzoneProps) => {
	const [fileName, setFileName] = useState("");

	const [ , , helpers ] = useField<File[]>({ name, ...props});

	const {getRootProps, getInputProps, isDragActive} = useDropzone({
		accept: accept,
		onDrop: acceptedFiles => {
			// do nothing if no files
			if (acceptedFiles.length === 0) { return; }
			// set field value!
			helpers.setValue(acceptedFiles);
			// Also set local state for the preview
			setFileName(acceptedFiles[0].name);
		}
	});

	return (
		<div>
			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<DropArea>{fileName ? `Uploaded: ${fileName}` : text}</DropArea>
			</div>
		</div>
	)
}