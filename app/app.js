Comments = new Mongo.Collection('comments');

if (Meteor.isClient) {
  //Meteor.subscribe('allComments');

  Template.CommentList.helpers({
    comments: function () {
      return Comments.find();
    },

    formatTimestamp: function (timestamp) {
      return moment(timestamp).calendar();
    }
  });

  Template.CommentAdd.events({
    'submit form': function (e, tmpl) {
      e.preventDefault();

      var formEl = tmpl.find('form');
      var commentEl = tmpl.find('[name=comment]');
      var comment = commentEl.value;

      Comments.insert({
        login: 'cmather',
        timestamp: new Date,
        room: 'main',
        comment: comment
      });

      formEl.reset();
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('allComments', function () {
    var cursor = Comments.find();
    var self = this;
    var handle = cursor.observeChanges({
      added: function (id, fields) {
        self.added('comments', id, fields);
      },

      changed: function (id, fields) {
        self.changed('comments', id, fields);
      },

      removed: function (id) {
        self.removed('comments', id);
      }
    });

    this.ready();

    this.onStop(function () {
      handle.stop();
    });
  });
}
