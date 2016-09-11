var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  when: Date,
  data: {},
}, {
  toObject: { virtuals: true }
})

eventSchema.index({when: 1});

module.exports = function MongoQueue(options) {

  options = options || {};
  var connection = options.connection || require('mongoose');;
  var modelName = options.modelName || 'LongtermEvent';
  var Event = connection.model('LongtermEvent', eventSchema, options.collection);

  return {
    peek: function(callback) {
      Event.findOne({}).sort('when').limit(1).lean().exec(respond(callback ));
    },

    enqueue: function(when, data, callback) {
      new Event({
        when: when,
        data: data
      }).save(respond(callback));
    },

    update: function(id, data, callback) {
      if (!isValid(id)) return callback(null, null);
      Event.findByIdAndUpdate(id, {data: data}, {new: true}, respond(callback))
    },

    remove: function(id, callback) {
      if (!isValid(id)) return callback(null, 0);
      Event.remove({_id: id}, function(err, data) {
        var n = data && data.result && data.result.n ? data.result.n : 0;
        callback(err, n);
      });
    },

    find: function(id, callback) {
      if (!isValid(id)) return callback(null, null);
      Event.findById(id, respond(callback)).lean();
    },

    count: function(callback) {
      Event.count({}, callback);
    },

    clear: function(callback) {
      Event.remove({}, function(err, data) {
        var n = data && data.result && data.result.n ? data.result.n : 0;
        callback(err, n);
      });
    }
  }
}

function isValid(id) {
  return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
}

function respond(callback) {
  return function(err, event) {
    if (err) console.error(err)
    if (err) return callback(err);
    if (event && typeof event.toObject === 'function') return callback(err, event.toObject());
    if (event) event.id = String(event._id);
    callback(err, event);
  }
}
