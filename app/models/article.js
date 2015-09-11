var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
  title: { type: String },
  content: { type: String },
  author: { type: ObjectId, ref: 'Person' },
  permission: { type: String, default: 'public' }, // ['public', 'protect', 'private']
  visit_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

mongoose.model('Article', ArticleSchema);