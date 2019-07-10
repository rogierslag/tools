import React, {Component, createRef, Fragment} from 'react';

import './things2slack.css';

import {Col, Row} from "react-grid-system";
import copy from '../copy/copy';

const textareaStyle = {
	width : '90%',
	padding : '12px',
	height : '450px',
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
			return `- [ ] ${input}`;
	}
	let todo = result[6];
	const done = result[5] === '+';

	const result2 = todo.match(WITH_DEADLINE);
	if(result2) {
		todo = result2[1];
	}
	return `- [${done ? 'x' : ' '}] ${todo}`;
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
			target : null,
		};
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
					<Col xs={12}>
						<textarea style={textareaStyle} value={this.calculate()} />
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
						<button onClick={() => {
							this.setState({target : 'todo'}, () => copy(this.calculate(), 'todo list'));
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
