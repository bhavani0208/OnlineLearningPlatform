const courseService = require('../services/courseService');
const {
  createCourseSchema,
  updateCourseSchema,
  createSectionSchema,
  createLessonSchema,
} = require('../validators/courseValidator');

const getAllCourses = async (req, res) => {
  try {
    const result = await courseService.getAllCourses(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const createCourse = async (req, res) => {
  const { error, value } = createCourseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const course = await courseService.createCourse(value, req.user.id);
    res.status(201).json({ success: true, message: 'Course created', data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateCourse = async (req, res) => {
  const { error, value } = updateCourseSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const course = await courseService.updateCourse(req.params.id, value, req.user.id);
    res.status(200).json({ success: true, message: 'Course updated', data: course });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    await courseService.deleteCourse(req.params.id, req.user.id, req.user.role);
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const createSection = async (req, res) => {
  const { error, value } = createSectionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const section = await courseService.createSection(req.params.id, value, req.user.id);
    res.status(201).json({ success: true, message: 'Section created', data: section });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const createLesson = async (req, res) => {
  const { error, value } = createLessonSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const lesson = await courseService.createLesson(req.params.id, value, req.user.id);
    res.status(201).json({ success: true, message: 'Lesson created', data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const courses = await courseService.getInstructorCourses(req.user.id);
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  createSection,
  createLesson,
  getInstructorCourses,
};
