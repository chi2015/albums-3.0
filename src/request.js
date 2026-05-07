import { serverUrl } from './config';

const paramsToBodyStr = (params) => {
    let arr = [];
    Object.keys(params).forEach((key) => {
        arr.push(`${key}=${params[key]}`);
    });
    return arr.join('&');
}

export default async function (params) {
    const config = {
		method: 'POST',
		headers: {
			'Accept': 'application/json, application/xml, text/play, text/html, *.*',
        	'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
		},
		body: paramsToBodyStr(params)
	};
	const response = await fetch(serverUrl, config);
	console.log('res', response);
	const data = await response.json();
	console.log('data', data)
	return data;
};