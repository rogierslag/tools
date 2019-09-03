import React, {Component, createRef, Fragment} from 'react';

import './ean2books.css';

import {Col, Row} from "react-grid-system";
import {bookError} from "../notifications/notification";

const textInputStyle = {
	width : '90%',
	padding : '12px',
	fontSize : '14px',
	marginBottom : '24px',
};

const tableStyle = {textAalign : 'left'};

const isProd = process.env['NODE_ENV'] === 'production';

async function fetchBook(ean) {
	if (!ean) {
		return null;
	}
	if (!isProd) {
		return {
			"title" : "Test",
			"author" : "Test",
			ean,
		};
	}

	const result = await fetch(`https://ean.rogierslag.nl/ean?ean=${ean}`, {mode : 'cors'});
	if (!result.ok) {
		return null;
	}
	return await result.json();
}

const LOCALSTORAGE_LASTBOOK_KEY = 'isbnCode';
const LOCALSTORAGE_ALLBOOKS_KEY = 'allBooks';

function getLocalState() {
	return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ALLBOOKS_KEY)) || [];
}

class Ean2Books extends Component {

	constructor(options) {
		super(options);

		this.state = {
			lastBook : null,
			allBooks : getLocalState(),
			isLoading : false,
		};
		this.ean = createRef()
	}

	componentDidMount = () => {
		if (typeof window !== 'undefined') {
			const lastOutput = window.localStorage.getItem(LOCALSTORAGE_LASTBOOK_KEY) || [];
			if (lastOutput) {
				this.ean.current.value = lastOutput;
			}
		}
		this.ean.current.focus();
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.ean.current.focus();
	}

	onSubmit = async (e) => {
		if (e.keyCode !== 13) {
			return;
		}
		this.setState({isLoading : true});
		const ean = this.ean.current.value;
		window.localStorage.setItem(LOCALSTORAGE_LASTBOOK_KEY, ean);
		this.ean.current.value = '';
		this.ean.current.focus();

		const book = await fetchBook(ean);
		if (!book) {
			bookError(ean);
			console.warn('Book could not be found', ean);
			this.setState({isLoading : false});
			return;
		}

		const storage = getLocalState();
		storage.unshift(book);
		this.setState({lastBook : book, allBooks : storage});
		window.localStorage.setItem(LOCALSTORAGE_ALLBOOKS_KEY, JSON.stringify(storage));
		this.setState({isLoading : false});
	};

	render() {
		let lastResult = null;
		if (this.state.lastBook) {
			lastResult = <Row>
				<Col xs={12}>
					<p>Last book scanned
						was <strong>{this.state.lastBook.title}</strong> from <strong>{this.state.lastBook.author}</strong>
					</p>
				</Col>
			</Row>
		}
		const allResults = <Row>
			<Col xs={12}>
				<table>
					<thead>
					<tr>
						<th style={{...tableStyle, width : '180px'}}>EAN</th>
						<th style={{...tableStyle, width : '300px'}}>Author(s)</th>
						<th style={{...tableStyle, width : '450px'}}>Title</th>
					</tr>
					</thead>
					<tbody>
					{this.state.allBooks.map((book, i) => <tr key={`${book.ean}${i}}`}>
						<td style={tableStyle}>{book.ean}</td>
						<td style={tableStyle}>{book.author}</td>
						<td style={tableStyle}>{book.title}</td>
					</tr>)}
					</tbody>
				</table>
			</Col>
		</Row>;

		return (
			<Fragment>
				<Row className="App-header">
					<Col xs={12}>
						<header>
							<h1>
								Scan your ISBN
							</h1>

							<p className="small" style={{marginBottom : '24px'}}>
								Scan any ISBN code, and a lookup will be performed and it will be added to your list
							</p>

							<Row gutterWidth={0}>
								<Col xs={12}>
									<input type="text" style={textInputStyle}
									       ref={this.ean} autoFocus={true}
									       onKeyDown={this.onSubmit}/>
								</Col>
							</Row>

						</header>
					</Col>
				</Row>
				{lastResult}
				{allResults}
			</Fragment>
		);
	}
}

export default Ean2Books;
