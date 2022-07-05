import { get } from 'api/AxiosClient';

export const getResponseTypes = async () => {
	return await get('/static-records/response-content-types')
		.then((res) => {
			let textTypes = [];
			let binaryTypes = [];

			res.data.forEach((item) => {
				if (item.responseType.name === 'TEXTUAL_RESPONSE') {
					textTypes.push(item.contentType);
				} else {
					binaryTypes.push(item.contentType);
				}
			});

			return {
				text: textTypes,
				binary: binaryTypes,
			};
		})
		.catch((err) => Promise.reject(err));
};