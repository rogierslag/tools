export const MAPPER_KEY = 'ing2budgetMapper';

function getMappers() {
	try {
		return window.localStorage.getItem(MAPPER_KEY) || null;
	} catch (e) {
		return null;
	}
}

export function getParsedMappers() {
	try {
		return JSON.parse(getMappers() || 'null');
	} catch (e) {
		console.warn('Couldnt parse mappers', e);
		return {};
	}
}

export function getFormattedMappers() {
	return JSON.stringify(getParsedMappers(), null, 4);
}

export function saveMappers(input) {
	if (input === null || input === undefined || input === '') {
		// Remove
		window.localStorage.removeItem(MAPPER_KEY);
		return;
	}
	// If not parseable, do not save this!
	try {
		JSON.parse(input);
		window.localStorage.setItem(MAPPER_KEY, input);
		return true;
	} catch (e) {
		return false;
	}
}
