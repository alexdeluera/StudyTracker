const Course = require("../model/Course");

exports.createCourse = async (req, res) => {
  const { number, name } = req.body;
  if (!number) 
    return res.status(400).json({ message: "Course number is required." });

  try {
    // 
    const course = await Course.create({
      number,
      name,
      user: req.userId
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listUserCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.userId }).lean();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};