import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Container, Grid, Form, Button } from "semantic-ui-react";
import "../css/app.css";

const BOUNDARY_STEP = 20;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchContent: "",
			response: null,
			history: [],
			boundary: BOUNDARY_STEP,
		};
	}

	handleInputOnChange(e) {
		e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value,
		});
	}

	handleSearch(e) {
		e.preventDefault();
		Meteor.call("wiki.search", this.state.searchContent, (error, result) => {
			const newHistory = this.state.history.slice();
			newHistory.push(this.state.searchContent);
			this.setState({
				searchContent: "",
				response: result,
				history: newHistory,
				boundary: BOUNDARY_STEP,
			});
		});
	}

	renderContent() {
		if (this.state.response !== undefined && this.state.response !== null) {
			return <span dangerouslySetInnerHTML={{__html: this.state.response.text["*"]}}></span>;
		} else {
			return "";
		}
	}

	handleClick(title) {
		Meteor.call("wiki.search", title, (error, result) => {
			const newHistory = this.state.history.slice();
			newHistory.push(title);
			this.setState({
				searchContent: "",
				response: result,
				history: newHistory,
				boundary: BOUNDARY_STEP,
			});
		});
	}

	handleShowMore() {
		const newBoundary = this.state.boundary + BOUNDARY_STEP;
		this.setState({
			boundary: newBoundary,
		});
	}

	handleShowLess() {
		const newBoundary = this.state.boundary - BOUNDARY_STEP;
		if (newBoundary > 0) {
			this.setState({
				boundary: newBoundary,
			});
		}
	}

	renderLinks() {
		if (this.state.response !== undefined && this.state.response !== null) {
			return (
				this.state.response.links.map((value, index) => {
					if (index < this.state.boundary) {
						return (
							<Button size={"mini"} key={index} onClick={() => this.handleClick(value["*"])}>
								{value["*"]}
							</Button>
						);
					} else if (index === this.state.boundary) {
						if (this.state.boundary > BOUNDARY_STEP) {
							return (
								<span>
									<Button size={"mini"} key={"need-more-button"} positive onClick={() => this.handleShowMore()}>I need more...</Button>
									<Button size={"mini"} key={"need-less-button"} negative onClick={() => this.handleShowLess()}>I need less...</Button>
								</span>);
						} else {
							return <Button size={"mini"} key={"need-more-button"} positive onClick={() => this.handleShowMore()}>I need more...</Button>;
						}
					} else {
						return "";
					}
				})
			);
		} else {
			return "";
		}
	}

	handleClickHistory(value, index) {
		Meteor.call("wiki.search", value, (error, result) => {
			const newHistory = this.state.history.slice(0, index + 1);
			this.setState({
				searchContent: "",
				response: result,
				history: newHistory,
				boundary: BOUNDARY_STEP,
			});
		});
	}

	renderHistory() {
		return this.state.history.map((value, index) => {
			return (
				<Button size={"mini"} key={index} onClick={() => this.handleClickHistory(value, index)}>{value}</Button>
			);
		});
	}

	render() {
		return (
			<Container>
				<Grid divided>
					<Grid.Row>
						<Grid.Column textAlign={"center"} width={"16"}>
							<h1>Wiki Search Engine</h1>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={"16"}>
							<h2>What do you want to know</h2>
							<Form>
								<Form.Field>
									<label>What do you want to know?</label>
									<input
										placeholder="Please, search something"
										name={"searchContent"}
										value={this.state.searchContent}
										onChange={(e) => this.handleInputOnChange(e)}
									/>
								</Form.Field>
								<Button positive onClick={(e) => this.handleSearch(e)}>Search</Button>
							</Form>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={"16"}>
							<h2>History</h2>
						</Grid.Column>
						<Grid.Column id={"historyBoard"} width={"16"}>
							{this.renderHistory()}
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={"16"}>
							<h2>Links</h2>
						</Grid.Column>
						<Grid.Column id={"linkBoard"} width={"16"}>
							{this.renderLinks()}
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={"16"}>
							<h2>Content</h2>
						</Grid.Column>
						<Grid.Column id={"contentBoard"} width={"16"}>
							{this.renderContent()}
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		);
	}
}

export default App;
