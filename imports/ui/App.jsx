import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Container, Grid, Form, Button } from "semantic-ui-react";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchContent: "",
			response: null,
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
			this.setState({
				searchContent: "",
				response: result,
			});
		});
	}

	renderContent() {
		if (this.state.response !== null) {
			return <span dangerouslySetInnerHTML={{__html: this.state.response.text["*"]}}></span>;
		} else {
			return "";
		}
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
							<h2>Links</h2>
						</Grid.Column>
						{/*{this.state.displayContent !== null ? this.state.displayContent.links[0]["*"] : ""}*/}
					</Grid.Row>
					<Grid.Row>
						<Grid.Column width={"16"}>
							<h2>Content</h2>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column id={"contentDisplayBoard"} width={"16"}>
							{this.renderContent()}
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		);
	}
}

export default App;
