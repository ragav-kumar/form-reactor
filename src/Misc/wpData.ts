import React from 'react'
import apiFetch from "@wordpress/api-fetch"
import axios from 'axios'

export interface WP_Data {
	imgUrl: string;
	/** For use in apiFetch */
	apiUrl: string;
	/** For use with standard fetch or axios */
	fullApiUrl: string;
	/** For use with standard fetch or axios */
	apiNonce: string;
	/** User ID, 0 if not logged in */
	user: number;
	/** ID of modal root node */
	modalRoot: string;
}

export const WPContext = React.createContext<WP_Data>({
	imgUrl: "",
	apiUrl: "",
	fullApiUrl: "",
	apiNonce: "",
	user: 0,
	modalRoot: "",
});

interface FetchArgs {
	path: string;
	method: 'POST';
	data?: object;
}
export const createWPFetch = (restUrl:string) => {
	return <T extends FetchResponseSuccess|FetchResponseFailure>(endpoint="/", data:object|false=false) => {
		let args:FetchArgs = {
			path: restUrl + endpoint,
			method: 'POST',
		};
		if (false !== data) {
			args.data = data;
		}
		return apiFetch<T>(args);
	}
}

export interface FetchResponseSuccess {
	success: true;
	data: any;
	error: undefined;
}
export interface FetchResponseFailure {
	success: false;
	data: undefined;
	error: string;
}

interface UploadFormData {
	files: File[];
	[x:string]:any;
}
/**
 * apiFetch doesn't take well to file uploads.
 * Or if it does, I haven't figured it out.
 * So, do this via axios instead
 * @param baseUrl REST API base url (full)
 * @param nonce REST API Nonce
 */
export const createAxiosObject = (baseUrl:string, nonce:string) => async <T extends FetchResponseSuccess|FetchResponseFailure>(endpoint:string, formData:UploadFormData) => {
	const url = baseUrl + endpoint;
	const {files, ...others} = formData;
	// Using FormData since it don't work otherwise.
	const data = new FormData();
	// Append files directly instead of within a files key
	if (files) {
		for (let i = 0; i < files.length; i++) {
			data.append(`file_${i}`, files[i]);
		}
	}
	// Append remaining keys as normal
	for (const key in others) {
		if (others.hasOwnProperty(key)) {
			const value = others[key];
			data.append(key, value);
		}
	}
	// nonce
	data.append('X-WP-Nonce', nonce);
	return (await axios.post<T>(url, data)).data;
}