import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
const wikipedia = require("node-wikipedia");

export const Statistics = new Mongo.Collection("statistics");

Meteor.methods({
	"wiki.search"(searchContent) {
		check(searchContent, String);
		if (Meteor.isServer) {
			const keyword = searchContent.toLowerCase();
			Statistics.insert({keyword: keyword, time: new Date()});

			return new Promise((resolve) => {
				wikipedia.page.data(searchContent, {content: true}, resolve);
			});
		}
	},
	"wiki.getStatistics"(history) {
		check(history, Array);
		if (Meteor.isServer) {
			const historyLower = history.map((value) => value.toLowerCase());
			const option = [{
				$match: {keyword: {$in: historyLower}},
			}, {
				$group: {_id: "$keyword", count: {$sum: 1}}
			}];
			return Statistics.rawCollection().aggregate(option).toArray();
		}
	}
});