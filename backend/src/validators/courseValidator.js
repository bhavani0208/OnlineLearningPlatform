const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).required(),
  price: Joi.number().min(0).required(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
  language: Joi.string().default('English'),
  categoryId: Joi.string().uuid().required(),
  thumbnail: Joi.string().uri().optional(),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().min(5).max(200),
  description: Joi.string().min(20),
  price: Joi.number().min(0),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  language: Joi.string(),
  categoryId: Joi.string().uuid(),
  thumbnail: Joi.string().uri().optional(),
  isPublished: Joi.boolean(),
});

const createSectionSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  order: Joi.number().integer().min(1).required(),
});

const createLessonSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  videoUrl: Joi.string().uri().optional(),
  duration: Joi.number().integer().min(0).default(0),
  order: Joi.number().integer().min(1).required(),
  isFree: Joi.boolean().default(false),
  content: Joi.string().optional(),
});

module.exports = {
  createCourseSchema,
  updateCourseSchema,
  createSectionSchema,
  createLessonSchema,
};
