import {NotificationManager} from 'react-notifications';

export function copied(type) {
	NotificationManager.info(`Copied ${type} to clipboard`, 'Copied', 3000)
}

export function bookError(ean) {
	NotificationManager.error(`Book with EAN '${ean}' could not be found`, 'Unknown book');
}

export function fileError(description) {
	NotificationManager.error(description, 'Invalid file');
}

export function problem(description) {
	NotificationManager.warn(description, 'Error', 3000)
}
