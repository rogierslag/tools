import React, {Component, createRef, Fragment} from 'react';

import './sets.css';

import {Col, Row} from "react-grid-system";
import copy from '../copy/copy';

const textareaStyle = {
	width : '90%',
	padding : '12px',
	height : '450px',
	fontSize : '14px',
};

class Sets extends Component {

	constructor(options) {
		super(options);

		this.state = {
			output : null,
		};
		this.setA = createRef();
		this.setB = createRef();
	}

	getValue(ref) {
		return new Set(ref.current.value.split('\n'))
	}

	unionAndCopy = () => {
		const a = this.getValue(this.setA);
		const b = this.getValue(this.setB);

		b.forEach(x => a.add(x));

		this.saveAndCopy(Array.from(a).join('\n'));
	};

	intersectionAndCopy = () => {
		const a = this.getValue(this.setA);
		const b = this.getValue(this.setB);

		const c = new Set();
		Array.from(a).filter(e => b.has(e)).forEach(e => c.add(e));

		this.saveAndCopy(Array.from(c).join('\n'));
	};

	differenceAndCopy = () => {
		const a = this.getValue(this.setA);
		const b = this.getValue(this.setB);

		b.forEach(x => a.delete(x));

		this.saveAndCopy(Array.from(a).join('\n'));
	};

	deduplicateAndCopy = () => {
		const a = this.getValue(this.setA);

		this.saveAndCopy(Array.from(a).join('\n'));
	};

	saveAndCopy(output) {
		copy(output, 'resulting list');
		this.setState({output});
	}

	onKeyDown = (e) => {
		// Ctrl-Enter or equivalent
		if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
			this.computeAndCopy();
		}
	};

	render() {
		let result = null;
		if (this.state.output !== null) {
			result =
				<Row>
					<Col xs={12}>
						<textarea style={textareaStyle} value={this.state.output}/>
					</Col>
				</Row>
		}

		return (
			<Fragment>
				<Row className="App-header">
					<Col xs={12}>
						<header>
							<h1>
								Add the items from the set (A) to the left, and add the items from set (B) to the right.
							</h1>

							<Row gutterWidth={0}>
								<Col xs={12} sm={6}>
									<textarea style={textareaStyle} ref={this.setA} onKeyDown={this.onKeyDown}/>
								</Col>
								<Col xs={12} sm={6}>
									<textarea style={textareaStyle} ref={this.setB} onKeyDown={this.onKeyDown}/>
								</Col>
							</Row>

						</header>
					</Col>
				</Row>
				<Row>
					<Col xs={6} offset={{xs : 3}}>
							Compute
					</Col>
				</Row>
				<Row>
					<Col xs={6} offset={{xs : 3}}>
						<button onClick={this.unionAndCopy}>Union</button>
						<button onClick={this.intersectionAndCopy}>Intersection</button>
						<button onClick={this.differenceAndCopy}>Difference</button>
						<button onClick={this.deduplicateAndCopy}>Deduplicate left</button>
					</Col>
				</Row>
				{result}
			</Fragment>
		);
	}
}

export default Sets;
