const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const user = new Schema({
  name: String,
  surname: String
})
module.exports = mongoose.model('users', user);