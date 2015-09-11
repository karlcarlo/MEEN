var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var PersonSchema = new Schema({
  email: { type: String },
  hashed_password: { type: String },
  salt: { type: String },
  name: { type: String, index: true },
  title: { type: String },
  avatar: { type: String },
  active: { type: Boolean, default: false },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

mongoose.model('Person', PersonSchema);