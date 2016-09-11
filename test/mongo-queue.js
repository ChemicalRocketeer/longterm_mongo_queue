var test = require('longterm-queue-test');
var MongoQueue = require('../mongo-queue');

require('mongoose').connect('mongodb://localhost/longterm_mongo_queue_test')

test(MongoQueue, 'MongoQueue');
