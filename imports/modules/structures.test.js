
// The 'meteor test' command
// The primary way to test your application in Meteor is the meteor test command.
// This loads your application in a special “test mode”. What this does is:
// Doesn’t eagerly load any of our application code as Meteor normally would.
// This is a highly important note as Meteor wouldn’t know of any methods/collections/publications unless you import them in your test files.
// Does eagerly load any file in our application (including in imports/ folders) that look like *.test[s].*, or *.spec[s].*
// Sets the Meteor.isTest flag to be true.
// Starts up the test driver package (see below).
// Additionally, Meteor offers a “full application” test mode. You can run this with meteor test --full-app.
// This is similar to test mode, with key differences:
// It loads test files matching *.app-test[s].* and *.app-spec[s].*.
// It does eagerly load our application code as Meteor normally would.
// Sets the Meteor.isAppTest flag to be true (instead of the Meteor.isTest flag).
// This means that the entirety of your application (including for instance the web server and client side router) is loaded and will run as normal. This enables you to write much more complex integration tests and also load additional files for acceptance tests.


import {Meteor} from 'meteor/meteor';
import * as chai from 'chai';

chai.should();

describe('structures', function () {

  if(Meteor.isClient){
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

});
