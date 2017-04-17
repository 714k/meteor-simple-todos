import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
	this.state = new ReactiveDict()
});


Template.body.helpers({
/*
	tasks: [
		{text: 'task 1'},
		{text: 'task 2'},
		{text: 'task 3'},
		{text: 'task 4'},
		{text: 'task 5'},
	]
*/
	tasks(){
		// return Tasks.find({});
		const instance = Template.instance();
		const completed = instance.state.get('hideCompleted');

		if (completed) {
			//If hide Completed is checked, filter tasks
			return Tasks.find({checked: {$ne: true} }, {sort: {createdAt: -1}});
		}

		// Otherwise return all the tasks 
		// show newest tasks at the top
		return Tasks.find({}, {sort: {createdAt: -1}});
	},

	incompleteCount(){
		return Tasks.find({checked: {$ne: true}}).count();
	}
});

Template.body.events({
	'submit .new-task'(event){
		event.preventDefault();

		// Get value from element
		const target = event.target;
		const text = target.text.value;

		// Insert tasks into the collection
		Tasks.insert({
			text,
			createdAt: new Date(), // current time
			owner: Meteor.userId(),
			username: Meteor.user().username
		});

		// Clear the form
		target.text.value = '';
	},
	'change .hide-completed input'(event, instance){
		instance.state.set('hideCompleted', event.target.checked);
	},
	'focus .new-task input'(event){
		event.target.placeholder = '';
	},
	'blur .new-task input'(event){
		event.target.placeholder = 'What do you like to do?';
	}
});