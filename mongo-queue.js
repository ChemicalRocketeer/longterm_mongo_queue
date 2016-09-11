var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  when: Date,
  data: {},
})

eventSchema.index({when: 1});

function MongoQueue(options) {

  var connection = options.connection || require('mongoose');;
  var modelName = options.modelName || 'LongtermEvent';
  var Event = connection.model('LongtermEvent', eventSchema, options.collection);

  return {
    peek: function(callback) {
      Event.find().sort('when').limit(1).exec(callback);
    },

    enqueue: function(when, data, callback) {
      new Event({
        when: when,
        data: data
      }).save(callback);
    },

    update: function(id, data, callback) {
      Event.findByIdAndUpdate(id, {data: data}, callback)
    },

    remove: function(id, callback) {
      Event.remove({_id: id}, callback);
    },

    find: function(id, callback) {
      Event.findById(id, callback);
    },

    count: function(callback) {
      Event.count(callback);
    },

    clear: function(callback) {
      Event.remove({}, callback);
    }
  }
}
