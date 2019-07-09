import months from "./months";

export default function calculate(csvData, withPerf) {
	const start = withPerf ? performance.now() : null;

	const data = csvData
		// Remove the header
		.splice(1)
		// Parse the data for easier format to work with
		.map(data => {
			return {
				date : data[0],
				name : data[1],
				amount : Number(`${data[5] === 'Af' ? '-' : ''}${data[6].replace(',', '.')}`)
			}
		})
		// Deterministic sorting
		.sort((l, r) => {
			if (l.date < r.date) {
				return -1;
			} else if (l.date > r.date) {
				return 1;
			}
			const nameCompare = l.name.localeCompare(r.name);
			if (nameCompare !== 0) {
				return nameCompare;
			}
			return l.amount < r.amount ? -1 : 1;
		})
		// To the format expected by Google sheets
		.map(({date, name, amount}) => {
			const year = date.substr(0, 4);
			const month = months[date.substr(4, 2)];
			const day = date.substr(6, 2);
			const formattedDate = `${day}-${month}-${year}`;
			return {
				formattedDate,
				name,
				amount,
			}
		});

	if (withPerf) {
		const duration = performance.now() - start;
		console.log(`Calculation took ${duration}ms`);
	}

	return data;
}
