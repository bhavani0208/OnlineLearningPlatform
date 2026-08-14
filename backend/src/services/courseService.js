const { Course, User, Category, Section, Lesson, Enrollment } = require('../models/index');
const { Op } = require('sequelize');

const getAllCourses = async (query) => {
  const { search, category, level, page = 1, limit = 10 } = query;
  const offset = (page - 1) * limit;

  const where = { isPublished: true };

  if (search) {
    where.title = { [Op.iLike]: `%${search}%` };
  }
  if (level) {
    where.level = level;
  }

  const include = [
    { model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName'] },
    { model: Category, as: 'category', attributes: ['id', 'name'] },
  ];

  if (category) {
    include[1].where = { name: { [Op.iLike]: `%${category}%` } };
  }

  const { count, rows } = await Course.findAndCountAll({
    where,
    include,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
  });

  return {
    courses: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
  };
};

const getCourseById = async (id) => {
  const course = await Course.findByPk(id, {
    include: [
      { model: User, as: 'instructor', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
      { model: Category, as: 'category', attributes: ['id', 'name'] },
      {
        model: Section, as: 'sections',
        include: [{ model: Lesson, as: 'lessons' }],
        order: [['order', 'ASC']],
      },
    ],
  });

  if (!course) throw new Error('Course not found');
  return course;
};

const createCourse = async (data, instructorId) => {
  const category = await Category.findByPk(data.categoryId);
  if (!category) throw new Error('Category not found');

  const course = await Course.create({ ...data, instructorId });
  return course;
};

const updateCourse = async (id, data, instructorId) => {
  const course = await Course.findByPk(id);
  if (!course) throw new Error('Course not found');
  if (course.instructorId !== instructorId) throw new Error('Not authorized to update this course');

  await course.update(data);
  return course;
};

const deleteCourse = async (id, instructorId, role) => {
  const course = await Course.findByPk(id);
  if (!course) throw new Error('Course not found');
  if (course.instructorId !== instructorId && role !== 'admin') {
    throw new Error('Not authorized to delete this course');
  }

  await course.destroy();
};

const createSection = async (courseId, data, instructorId) => {
  const course = await Course.findByPk(courseId);
  if (!course) throw new Error('Course not found');
  if (course.instructorId !== instructorId) throw new Error('Not authorized');

  const section = await Section.create({ ...data, courseId });
  return section;
};

const createLesson = async (sectionId, data, instructorId) => {
  const section = await Section.findByPk(sectionId, {
    include: [{ model: Course, as: 'course' }],
  });
  if (!section) throw new Error('Section not found');
  if (section.course.instructorId !== instructorId) throw new Error('Not authorized');

  const lesson = await Lesson.create({ ...data, sectionId });

  // Update totalLessons count on course
  await Course.increment('totalLessons', { where: { id: section.courseId } });

  return lesson;
};

const getInstructorCourses = async (instructorId) => {
  const courses = await Course.findAll({
    where: { instructorId },
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name'] },
      { model: Enrollment, as: 'enrollments', attributes: ['id'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  return courses;
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
