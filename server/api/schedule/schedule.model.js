'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ConstraintSchema = new mongoose.Schema({
  start: Date,
  end: Date
});

//testing stuff
var VolunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  username: String,
  password: String,
  childTeam: String,
  comments: String,
  shirt: String,
  positions: Array,
  preference1: String,
  preference2: String,
  isJudge: Boolean,
  constraints: [ConstraintSchema]
});

var SlotSchema = new mongoose.Schema({
  assigned: [VolunteerSchema],
  positions: Number,
  location: String,
  start: Date,
  end: Date
});

var JobSchema = new mongoose.Schema({
  name: String,
  training: Number,
  isJudging: Boolean,
  defaultLocation: Boolean,
  location: String,
  slots: [SlotSchema]
});

var ProblemSchema = new mongoose.Schema({
  problem: String,
  division: String,
  longterm: String,
  spontaneous: String
});

var TeamSchema = new mongoose.Schema({
  number: String,
  problems: [ProblemSchema]
});

var ScheduleSchema = new mongoose.Schema({
  name: String,
  date: Date,
  info: String,
  jobs: [JobSchema],
  teams: [TeamSchema],
  unassigned: [VolunteerSchema]
});

export default mongoose.model('Schedule', ScheduleSchema);
