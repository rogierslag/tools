import React, {Component} from 'react';

import './App.css';
import 'react-notifications/lib/notifications.css';

import {Container, Row, Col} from "react-grid-system";
import {NotificationContainer, } from 'react-notifications';
import Ing2Budget from "./ing2budget/ing2budget";
import Things2Slack from './things2slack/things2slack'

class Header extends Component {
	render() {
		return <Row className="App-header header">
			<Col xs={12} sm={6} className="headerItem">
				<img src="/images/ing.jpg" onClick={() => this.props.onSelect('ing2budget')} />
			</Col>
			<Col xs={12} sm={6} className="headerItem">
				<img src="/images/things.jpg" onClick={() => this.props.onSelect('things2slack')}/>
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

	onClear = (e) => {
		e.preventDefault();
		this.setState({tool : null});
	};

	onSelect = (e) => {
		this.setState({tool: e});
	};

	toolToRender = () => {
		switch(this.state.tool) {
			case 'things2slack':
				return <Things2Slack />;
			case 'ing2budget':
				return <Ing2Budget />;
			default:
				return <Header onSelect={this.onSelect} />;
		}
	};

	render() {
		return (
			<Container fluid className="App">
				<NotificationContainer/>
				{this.toolToRender()}
			</Container>
		);
	}
}

export default App;
