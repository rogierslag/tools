import React, {Component, Fragment} from 'react';

import './App.css';
import 'react-notifications/lib/notifications.css';

import months from "./months";
import {parse, stringify} from "csv/lib/sync";
import {Col, Container, Row} from "react-grid-system";
import copy from 'clipboard-copy';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Dropzone from 'react-dropzone';

function toCsvFormat({formattedDate, amount, name}) {
	const absAmount = Math.abs(amount);
	return [formattedDate, absAmount, name];
}

const textareaStyle = {
	width : '80%',
	height : '250px',
};

const WITH_PERF = window.location.hash.includes('perf');

const CSV_OPTS = {delimiter : "\t"};

class App extends Component {

	constructor(options) {
		super(options);

		this.state = {
			csvContents : null,
			file : null,
		};
		if (WITH_PERF) {
			console.log('Logging performance metrics as well!');
		}
	}

	onClear = (e) => {
		e.preventDefault();
		this.setState({csvContents : null, file : null});
	};

	fileRead = (e) => {
		const csvContents = e.target.result;
		this.setState({csvContents})
	};

	fileUploaded = (files) => {
		this.setState({csvContents : null, file : null});

		const file = files[0];

		if (!file) {
			console.error('Problem reading file');
			NotificationManager.error(`The supplied file could not be read`, 'Invalid file');
			return;
		}
		this.setState({file});
		if (file.type !== 'text/csv') {
			NotificationManager.error(`Try uploading a CSV file`, 'Invalid file');
			return;
		}

		const reader = new FileReader();
		reader.onload = this.fileRead;
		reader.readAsText(file);
	};

	calculate = () => {
		const start = WITH_PERF ? performance.now() : null;

		const data = parse(this.state.csvContents)
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

		const expenses = stringify(data.filter(e => e.amount < 0).map(toCsvFormat), CSV_OPTS);

		const income = stringify(data.filter(e => e.amount >= 0).map(toCsvFormat), CSV_OPTS);

		if (WITH_PERF) {
			const duration = performance.now() - start;
			console.log(`Calculation took ${duration}ms`);
		}

		return {income, expenses};
	};

	copyToClipboard = (data, type) => {
		copy(data).then(() => NotificationManager.info(`Copied ${type} to clipboard`, 'Copied', 3000))
			.catch(error => {
				console.warn(error);
				NotificationManager.warn(`Could not copy ${type} to clipboard`, 'Error', 3000);
			});
	};

	render() {
		let result = null;
		if (this.state.csvContents) {
			const {income, expenses} = this.calculate();
			result = <Fragment>
				<Row className="copyButtons">
					<Col xs={6}>
						<button onClick={() => this.copyToClipboard(expenses, 'expenses')}>
							Copy expenses to clipboard
						</button>
					</Col>
					<Col xs={6}>
						<button onClick={() => this.copyToClipboard(income, 'income')}>
							Copy income to clipboard
						</button>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={6}>
						<p>Expenses</p>
						<textarea style={textareaStyle} value={expenses} readOnly/>
					</Col>

					<Col xs={12} sm={6}>
						<p>Income</p>
						<textarea style={textareaStyle} value={income} readOnly/>
					</Col>
				</Row>
			</Fragment>
		}

		return (
			<Container fluid className="App">
				<NotificationContainer/>
				<Row>
					<Col xs={12}>
						<header className="App-header">
							<h1>
								Upload your CSV export from ING below.
							</h1>

							<p className="small" style={{marginBottom: '24px'}}>
								You can then directly paste the resulting values in a&nbsp;
								<a href="https://docs.google.com/spreadsheets/d/1ftoN7nWBRN5N35OzFer_wr6DUH8DpY8kpUuUAOBG2N8/edit?usp=sharing"
								   target="_blank"
								   className="App-link"
								   rel="noreferrer noopener">
									Google spreadsheet
								</a>
								.
							</p>
							<Row>
								<Col xs={12}>
									<Dropzone onDrop={this.fileUploaded}>
										<p className="dropzone">Drop your ING CSV export file here, or click to browse to it.</p>
									</Dropzone>
								</Col>
							</Row>
							<Row>
								<Col xs={12} style={{height : '50px'}}>
									{this.state.file && <p className="small">
										<button className="clear" onClick={this.onClear}>X</button>
										{this.state.file.name} ({Math.ceil(this.state.file.size / 1024)} kb)</p>}
								</Col>
							</Row>
						</header>
					</Col>
				</Row>
				{result}
			</Container>
		);
	}
}

export default App;
