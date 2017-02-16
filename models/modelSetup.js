var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
var userSchema = new Schema({
  id:           ObjectId,
  userName:     { type: String, required: true},
  firstName:    { type: String, required: true},
  lastName:     { type: String, required: true},
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true},
  data:         Object
});

//var user = mongoose.model('user', userSchema);
//exports.user = user;

module.exports = mongoose.model('user', userSchema);