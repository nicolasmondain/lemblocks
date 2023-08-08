import {Meteor} from 'meteor/meteor';
import {BlocksCollection} from '../imports/api/BlocksCollection.js';

Meteor.startup(() => {

	Meteor.publish('blocks', () => BlocksCollection.find());

});
