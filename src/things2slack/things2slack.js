import React, {Component, createRef, Fragment} from 'react';

import './things2slack.css';

import {Col, Row} from "react-grid-system";
import copy from '../copy/copy';

const textareaStyle = {
	width : '90%',
	padding : '12px',
	height : '450px',
	fontSize: '14px',
};

// Matches stuff scheduled for some day
// - 10/07/2019 [ ] Finish company card completion block
const SCHEDULED_FOR_TODAY = new RegExp(/-\s(\(?(\d{2})\/(\d{2})\/(\d{4}))\)?\s\[(.)\]\s(.*)/);

// Matches a final part which ends with a deadline
// Prep 1on1s (10/07/2019)
const WITH_DEADLINE = new RegExp(/(^(?!(\((\d{2})\/(\d{2})\/(\d{4})\))).*)\s(\((\d{2})\/(\d{2})\/(\d{4})\))/);

function toStructure(input) {
	const result = input.match(SCHEDULED_FOR_TODAY);
	if (!result) {
		if (input.trimLeft().startsWith('- [ ]')
			|| input.trimLeft().startsWith('- [x]')
			|| input.trimLeft().startsWith('- [~]')
			|| input.trimLeft().startsWith('- [-]')
			|| input.trimLeft().startsWith('- [X]')) {
			const start = input.substr(0, input.indexOf(']') + 1);
			const end = input.substr(input.indexOf(']') + 1);
			return `${start.toLowerCase()}${end}`;
		}
		return `- [ ] ${input}`;
	}
	let todo = result[6];
	const done = ['+', 'x', '~'].includes(result[5] || '');

	const result2 = todo.match(WITH_DEADLINE);
	if (result2) {
		todo = result2[1];
	}
	return `- [${done ? 'x' : ' '}] ${todo}`;
}

function rewrite(input) {
	return Array.from(new Set(input.split('\n')
		.map(e => e.trimRight())
		.filter(e => e)
		.map(toStructure)
		.filter(e => e)))
		.join('\n');
}

const LOCALSTORAGE_KEY = 'lastThingsToSlackOutput';

class Things2Slack extends Component {

	constructor(options) {
		super(options);

		this.state = {
			output : null,
		};
		this.textArea = createRef()
	}

	componentDidMount = () => {
		if (typeof window !== 'undefined') {
			const lastOutput = window.localStorage.getItem(LOCALSTORAGE_KEY);
			if (lastOutput) {
				this.textArea.current.value = lastOutput;
			}
		}
	};

	onClear = (e) => {
		e.preventDefault();
		this.setState({output : null});
	};

	updateCalculatedState = (event) => {
		this.setState({output : event.target.value});
	};

	calculate = () => {
		const output = rewrite(this.textArea.current.value);
		this.setState({output});
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(LOCALSTORAGE_KEY, output);
		}
		return output;
	};

	calculateAndCopy = () => {
		const output = this.calculate();
		copy(output, 'todo list');
	};

	render() {
		let result = null;
		if (this.state.output !== null) {
			result =
				<Row>
					<Col xs={12}>
						<textarea style={textareaStyle} value={this.state.output}
						          onChange={this.updateCalculatedState}/>
					</Col>
				</Row>
		}

		return (
			<Fragment>
				<Row className="App-header">
					<Col xs={12}>
						<header>
							<h1>
								Add your items from Things below
							</h1>

							<p className="small" style={{marginBottom : '12px'}}>
								Any schedule dates and deadlines will be stripped, and the checkboxes will be changed
								towards the Github format.
							</p>
							<p className="small" style={{marginBottom : '24px'}}>
								You can then directly paste the resulting values in Slack.
							</p>

							<Row gutterWidth={0}>
								<Col xs={12}>
									<textarea style={textareaStyle} ref={this.textArea}/>
								</Col>
							</Row>

						</header>
					</Col>
				</Row>
				<Row className="copyButtons">
					<Col xs={6} offset={{xs : 3}}>
						<button onClick={this.calculateAndCopy}>
							Format and copy
						</button>
					</Col>
				</Row>
				{result}
			</Fragment>
		);
	}
}

export default Things2Slack;
