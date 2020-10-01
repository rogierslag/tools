import {parse, stringify} from "csv/lib/sync";

const CSV_OPTS = {delimiter : "\t"};

function asCsv({formattedDate, amount, name, category}) {
	const absAmount = Math.abs(amount);
	return [formattedDate, absAmount, name, category];
}

export function fromCsvFormat(data) {
	return parse(data, {
		delimiter : ';',
	});
}

export function toCsvFormat(data) {
	const expenses = stringify(data.filter(e => e.amount < 0).map(asCsv), CSV_OPTS);

	const income = stringify(data.filter(e => e.amount >= 0).map(asCsv), CSV_OPTS);

	return {income, expenses};
}
