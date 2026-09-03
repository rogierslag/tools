import {toast} from 'react-toastify';

export function copied(type) {
	toast.info(`Copied ${type} to clipboard`, {autoClose: 3000});
}

export function bookError(ean) {
	toast.error(`Unknown book: EAN '${ean}' could not be found`);
}

export function fileError(description) {
	toast.error(`Invalid file: ${description}`);
}

export function problem(description) {
	toast.warn(description, {autoClose: 3000});
}
