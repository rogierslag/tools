import copy from 'clipboard-copy';
import {copied, problem} from "../notifications/notification";

export default function copyToClipboard(data, type) {
	copy(data).then(() => copied(type, 'Copied', 3000))
		.catch(error => {
			console.warn(error);
			problem(`Could not copy ${type} to clipboard`, 'Error', 3000);
		});
};
