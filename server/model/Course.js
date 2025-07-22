// server/model/Course.js
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const CourseSchema = new Schema({
  number: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    default: ""
  },
  // Many-one relationship, pass object by reference
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, );

module.exports = mongoose.model("Course", CourseSchema);
