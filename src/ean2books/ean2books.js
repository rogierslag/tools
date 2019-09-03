import React, {Component, createRef, Fragment} from 'react';

import './ean2books.css';

import {Col, Row} from "react-grid-system";
import {bookError} from "../notifications/notification";
import {CSVDownload} from "react-csv";

const textInputStyle = {
	width : '90%',
	padding : '12px',
	fontSize : '14px',
	marginBottom : '8px',
};
const closeIcon = {
	cursor : 'pointer',
	marginLeft: '8px',
	marginRight: '8px',
};

const tableStyle = {textAlign : 'left'};

const isProd = process.env['NODE_ENV'] === 'production';

async function fetchBook(ean) {
	const trimmedEan = (ean || '').trim();
	if (!trimmedEan) {
		return null;
	}
	if (!isProd) {
		return new Promise((resolve => {
			setTimeout(() => resolve({
				"title" : "Test",
				"author" : "Test",
				trimmedEan,
			}), 3500);
		}));
	}

	const result = await fetch(`https://ean.rogierslag.nl/ean?ean=${trimmedEan}`, {mode : 'cors'});
	if (!result.ok) {
		return null;
	}
	return await result.json();
}

const LOCALSTORAGE_ALLBOOKS_KEY = 'allBooks';

function getLocalState() {
	return JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ALLBOOKS_KEY)) || [];
}

function updateLocalState(allBooks) {
	window.localStorage.setItem(LOCALSTORAGE_ALLBOOKS_KEY, JSON.stringify(allBooks));
}

class Ean2Books extends Component {

	constructor(options) {
		super(options);

		this.state = {
			lastBook : null,
			allBooks : getLocalState(),
			currentlyLoading : 0,
		};
		this.ean = createRef()
	}

	componentDidMount = () => {
		this.ean.current.focus();
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		this.ean.current.focus();
	}

	onSubmit = async (e) => {
		if (e.keyCode !== 13) {
			return;
		}
		this.setState((prevState) => ({currentlyLoading : prevState.currentlyLoading + 1}));
		const ean = this.ean.current.value;
		this.ean.current.value = '';
		this.ean.current.focus();

		const book = await fetchBook(ean);
		if (!book) {
			bookError(ean);
			console.warn('Book could not be found', ean);
			this.setState((prevState) => ({currentlyLoading : prevState.currentlyLoading - 1}));
			return;
		}

		const storage = getLocalState();
		storage.unshift(book);
		this.setState((prevState) => ({
			lastBook : book,
			allBooks : storage,
			currentlyLoading : prevState.currentlyLoading - 1
		}));
		updateLocalState(storage);
	};

	remove = (i) => {
		const copy = [...this.state.allBooks];
		copy.splice(i, 1);
		this.setState({allBooks : copy});
		updateLocalState(copy);
	};

	download = () => {
		this.setState({asDownload: true});
		setTimeout(() => this.setState({asDownload: false}), 250);
	};

	asDownload = () => {
		if(!this.state.asDownload) {
			return;
		}
		const data = [['EAN','Author','Title'], ...this.state.allBooks.map(({ean, author, title}) => ([ean, author, title]))];
		return <CSVDownload data={data} target="_blank" />;
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
						<td style={tableStyle}><span style={closeIcon} onClick={() => this.remove(i)}>×</span></td>
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
								Scan your EAN
							</h1>

							<p className="small" style={{marginBottom : '24px'}}>
								Scan any books EAN code, and a lookup will be performed and it will be added to your
								list
							</p>

							<input type="text" style={textInputStyle}
							       ref={this.ean} autoFocus={true}
							       onKeyDown={this.onSubmit}/>

							<p className="small" style={{marginBottom : '24px'}}>
								There are currently <i>{this.state.currentlyLoading} request(s) in-flight</i>.
								<br />
								<button onClick={this.download}>Download overview</button>
							</p>

						</header>
					</Col>
				</Row>
				{lastResult}
				{allResults}
				{this.asDownload()}
			</Fragment>
		);
	}
}

export default Ean2Books;
