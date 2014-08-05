Chat = new Meteor.Collection('chat')
Anncouncements = new Meteor.Collection('announcements')
Settings = new Meteor.Collection('settings')

Chat.insert({name: 'main', messages: [
            	{
            		msg: 'Tere hommikust',
            		date: Date.now(),
            		ahow: 2,
            		author: 'krister',
            		bold: 0,
            	}
            ]})