const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

const Project = mongoose.model('Project', projectSchema)

const dataSchema = new Schema({
  title: String,
  abstract: String,
  originUrl: String,
  classifierScore: String,
  similarityScore: Number,
  body: String,
  source: String,
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  version: [String],
  relavance: String,
  remark: {
    type: String,
    default: ''
  }
})

const Data = mongoose.model('Data', dataSchema)

const versionSchema = new Schema({
  name: String,
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  score: {
    type: String,
    default: '-'
  }
})

const Version = mongoose.model('Version', versionSchema)

module.exports = {
  Project,
  Data,
  Version
}
