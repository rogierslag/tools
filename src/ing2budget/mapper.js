export const MAPPER_KEY = 'ing2budgetMapper';

function getMappers() {
	try {
		return window.localStorage.getItem(MAPPER_KEY) || null;
	} catch (e) {
		return null;
	}
}

function getParsedMappers() {
	try {
		return JSON.parse(getMappers() || 'null');
	} catch (e) {
		console.warn('Couldnt parse mappers', e);
		return {};
	}
}

export function applyMapper(name) {
	try {
		const allMappers = getParsedMappers();
		if (allMappers) {
			const [key, category] = Object.entries(allMappers)
				.find(([key]) => name.toLowerCase().includes(key.toLowerCase()));
			return category;
		}
	} catch (e) {
		// ow no terrible
		console.warn('Something threw while trying to determine categories', e);
	}
	return undefined;
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
	// If not parsable, do not save this!
	try {
		const parsed = JSON.parse(input);
		const keyMismatch = Object.keys(parsed).find(key => typeof key !== 'string');
		const valueMismatch = Object.values(parsed).find(key => typeof key !== 'string');
		if (keyMismatch || valueMismatch) {
			// only stringies are accepted
			return false;
		}
		window.localStorage.setItem(MAPPER_KEY, input);
		return true;
	} catch (e) {
		return false;
	}
}
