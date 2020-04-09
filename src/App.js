import React, {Component} from 'react';

import './App.css';
import 'react-notifications/lib/notifications.css';

import {Col, Container, Row} from "react-grid-system";
import {NotificationContainer,} from 'react-notifications';
import Ing2Budget from "./ing2budget/ing2budget";
import Things2Slack from './things2slack/things2slack'
import Ean2Books from "./ean2books/ean2books";
import Sets from "./sets/sets";

class Header extends Component {
	render() {
		return <Row className="App-header header">
			<Col xs={12}>
				<h1>Pick a tool to use</h1>
			</Col>
			<Col xs={12} sm={6} className="headerItem">
				<img alt="" src="/images/ing.jpg" onClick={() => this.props.onSelect('ing2budget')}/>
				<p>Convert CSV from ING to Google Spreadsheets</p>
			</Col>
			<Col xs={12} sm={6} className="headerItem">
				<img alt="" src="/images/things.jpg" onClick={() => this.props.onSelect('things2slack')}/>
				<p>Convert a list from Things to a Slack list</p>
			</Col>
			<Col xs={12} sm={6} className="headerItem">
				<img alt="" src="/images/books.png" onClick={() => this.props.onSelect('ean2books')}/>
				<p>Scan a bunch of books</p>
			</Col>
			<Col xs={12} sm={6} className="headerItem">
				<img alt="" src="/images/set.png" onClick={() => this.props.onSelect('sets')}/>
				<p>Set actions</p>
			</Col>
		</Row>
	}
}

class App extends Component {

	constructor(options) {
		super(options);

		this.state = {
			tool : null,
		};
	}

	componentDidMount() {
		if (window && window.location.pathname) {
			const tool = window.location.pathname.substr(1);
			this.setState({tool});
		}
	}

	onClear = (e) => {
		e.preventDefault();
		this.setState({tool : null});
		window.history.pushState({}, e, `/`);
	};

	onSelect = (e) => {
		this.setState({tool : e});
		if (window && window.history) {
			window.history.pushState({}, e, `/${e}`);
		}
	};

	toolToRender = () => {
		switch (this.state.tool) {
			case 'things2slack':
				return <Things2Slack/>;
			case 'ing2budget':
				return <Ing2Budget/>;
			case 'ean2books':
				return <Ean2Books/>;
			case 'sets':
				return <Sets/>;
			default:
				return <Header onSelect={this.onSelect}/>;
		}
	};

	reloadIcon = () => {
		if (!this.state.tool) {
			return null;
		}
		return <img className="restartIcon"
		            src="/images/restart.png"
		            alt="restart"
		            onClick={this.onClear}/>;
	};

	render() {
		return (
			<Container fluid className="App">
				<NotificationContainer/>
				{this.reloadIcon()}
				{this.toolToRender()}
			</Container>
		);
	}
}

export default App;
