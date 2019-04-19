import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
const wikipedia = require("node-wikipedia");

Meteor.methods({
	"wiki.search"(searchContent) {
		check(searchContent, String);
		return new Promise((resolve) => {
			wikipedia.page.data(searchContent, { content: true }, resolve);
		});
	}
});