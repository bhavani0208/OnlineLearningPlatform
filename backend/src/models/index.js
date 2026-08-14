const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Course = require('./Course');
const Section = require('./Section');
const Lesson = require('./Lesson');
const Enrollment = require('./Enrollment');
const Order = require('./Order');
const Payment = require('./Payment');
const Review = require('./Review');

// User -> Course (instructor creates courses)
User.hasMany(Course, { foreignKey: 'instructorId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// Category -> Course
Category.hasMany(Course, { foreignKey: 'categoryId', as: 'courses' });
Course.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Course -> Section
Course.hasMany(Section, { foreignKey: 'courseId', as: 'sections', onDelete: 'CASCADE' });
Section.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Section -> Lesson
Section.hasMany(Lesson, { foreignKey: 'sectionId', as: 'lessons', onDelete: 'CASCADE' });
Lesson.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

// User + Course -> Enrollment
User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'student' });
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User + Course -> Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Course.hasMany(Order, { foreignKey: 'courseId', as: 'orders' });
Order.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Order -> Payment
Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// User + Course -> Review
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Course.hasMany(Review, { foreignKey: 'courseId', as: 'reviews' });
Review.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Sync all models to database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('All tables synced to Neon.tech successfully');
  } catch (error) {
    console.error('Database sync failed:', error.message);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Category,
  Course,
  Section,
  Lesson,
  Enrollment,
  Order,
  Payment,
  Review,
};
