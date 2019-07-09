import React, {Component, Fragment, createRef} from 'react';

import './things2slack.css';

import {Col, Row} from "react-grid-system";
import copy from '../copy/copy';
import {problem} from "../notifications/notification";

const textareaStyle = {
	width : '90%',
	marginLeft: '-12px',
	marginRight: '-12px',
	padding: '12px',
	height : '450px',
};

const WITH_PERF = window.location.hash.includes('perf');

const regex = new RegExp(/-\s(\(?(\d{2})\/(\d{2})\/(\d{4}))\)?\s\[(.)\]\s(.*)/);

function toStructure(input) {
	const result = input.match(regex);
	if(!result) {
		return null;
	}
	const done = result[5] === '+';
	console.log(result);
	return `- [${done ? 'x' : ' '}] ${result[6]}`;
}

function rewrite(input) {
	return input.split('\n')
		.map(e => e.trim())
		.filter(e => e)
		.map(toStructure)
		.filter(e => e)
		.join('\n');
}

class Things2Slack extends Component {

	constructor(options) {
		super(options);

		this.state = {
			input : null,
			target: null,
		};
		if (WITH_PERF) {
			console.log('Logging performance metrics as well!');
		}
		this.textArea = createRef()
	}

	onClear = (e) => {
		e.preventDefault();
		this.setState({input : null});
	};

	calculate = () => {
		return rewrite(this.textArea.current.value, this.state.target);
	};

	render() {
		let result = null;
		if (this.textArea.current && this.textArea.current.value && this.state.target) {
			result =
				<Row>
					<Col xs={12} >
						<textarea style={textareaStyle} value={this.calculate()} readOnly/>
					</Col>
				</Row>
		}

		return (
			<Fragment>
				<Row>
					<Col xs={12}>
						<header className="App-header">
							<h1>
								Add your items from Things below
							</h1>

							<p className="small" style={{marginBottom : '24px'}}>
								You can then directly paste the resulting values in Slack.
							</p>

							<Row style={{width: '90%'}} gutterWidth={0}>
								<Col xs={12}>
									<textarea style={textareaStyle} ref={this.textArea} />
								</Col>
							</Row>

						</header>
					</Col>
				</Row>
				<Row className="copyButtons">
					<Col xs={6} offset={{xs: 3}}>
						<button onClick={() => {
							this.setState({target: 'todo'}, () => copy(this.calculate(), 'todo list'));
						}}>
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
