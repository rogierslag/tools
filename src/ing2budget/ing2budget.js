import React, {Component, Fragment} from 'react';

import './ing2budget.css';

import {Col, Row} from "react-grid-system";
import copy from '../copy/copy';
import Dropzone from 'react-dropzone';
import {fileError} from "../notifications/notification";
import {fromCsvFormat, toCsvFormat} from "./csv";
import calculate from "./calculate";

const textareaStyle = {
	width : '80%',
	height : '250px',
};

const WITH_PERF = window.location.hash.includes('perf');

class Ing2Budget extends Component {

	constructor(options) {
		super(options);

		this.state = {
			data : '',
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
			fileError(`The supplied file could not be read`);
			return;
		}
		this.setState({file});
		if (file.type !== 'text/csv') {
			fileError(`Try uploading a CSV file`);
			return;
		}

		const reader = new FileReader();
		reader.onload = this.fileRead;
		reader.readAsText(file);
	};

	calculate = () => {
		const input = fromCsvFormat(this.state.csvContents);
		const data = calculate(input, WITH_PERF);
		return toCsvFormat(data);
	};

	render() {
		let result = null;
		if (this.state.csvContents) {
			const {income, expenses} = this.calculate();
			result = <Fragment>
				<Row className="copyButtons">
					<Col xs={6}>
						<button onClick={() => copy(expenses, 'expenses')}>
							Copy expenses to clipboard
						</button>
					</Col>
					<Col xs={6}>
						<button onClick={() => copy(income, 'income')}>
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
			<Fragment>
				<Row>
					<Col xs={12}>
						<header className="App-header">
							<h1>
								Upload your CSV export from ING below.
							</h1>

							<p className="small" style={{marginBottom : '24px'}}>
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
										{({getRootProps, getInputProps, isDragActive}) => {
											return (
												<p className="dropzone" {...getRootProps()}>
													Drop your ING CSV export file here, or click to browse to it.
													<input {...getInputProps()} />
												</p>
											);
										}}
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
			</Fragment>
		);
	}
}

export default Ing2Budget;
