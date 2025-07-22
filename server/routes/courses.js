const express = require("express");
const router  = express.Router();
const coursesCtrl = require("../ctrls/coursesCtrl");

// Create new course
router.post("/", coursesCtrl.createCourse);

// get all courses
router.get("/",  coursesCtrl.listUserCourses);

module.exports = router;