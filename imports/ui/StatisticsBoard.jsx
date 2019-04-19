import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Icon } from "semantic-ui-react";
import PropTypes from "prop-types";

export default class StatisticsBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			statistics: [],
		};
		this.hidden = true;
	}

	handleClick() {
		if (this.hidden) {
			document.getElementById("boardItem").style.right = "250px";
			document.getElementById("board").style.right = "0px";
			this.hidden = false;
		} else {
			document.getElementById("boardItem").style.right = "0px";
			document.getElementById("board").style.right = "-250px";
			this.hidden = true;
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.update) {
			const history = nextProps.history;
			Meteor.call("wiki.getStatistics", history, (error, result) => {
				this.setState({
					statistics: result,
				});
			});
		}
	}

	renderStatistics() {
		return this.state.statistics.map((value) => {
			return (
				<div className={"board-item-wrapper"} key={value._id}>
					<div className={"board-left-item"}>{value._id}</div>
					<div className={"board-right-item"}>{value.count}</div>
				</div>
			);
		});
	}

	render() {
		const temp = this.state.statistics.length > 1 ? "these topics?" : "this topic?";
		return (
			<div>
				<div id={"boardItem"} onClick={() => {this.handleClick();}}>
					<Icon className={"boardItemIcon"} size={"big"} name={"question circle"} onClick={() => {this.handleClick();}}/>
				</div>
				<div id={"board"}>
					<h3>{"How many people have search " + temp}</h3>
					<div className={"board-item-wrapper"}>
						<div className={"board-left-item"}><h4>Keywords</h4></div>
						<div className={"board-right-item"}><h4>Count</h4></div>
					</div>
					{this.renderStatistics()}
				</div>
			</div>
		);
	}
}

StatisticsBoard.propTypes = {
	history: PropTypes.array.isRequired,
	update: PropTypes.bool.isRequired,
};