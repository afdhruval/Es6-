require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Activity = require('../models/Activity');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_admin');
    console.log('MongoDB Connected for Seeding');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await Admin.deleteMany();
    await Category.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Activity.deleteMany();

    console.log('Seeding Admin...');
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@lms.com',
      password: 'password123', // Will be hashed by pre-save hook
      role: 'admin'
    });

    console.log('Seeding Categories...');
    const categories = await Category.insertMany([
      { name: 'Web Development', description: 'Frontend and Backend technologies', icon: 'fa-code', color: '#3b82f6' },
      { name: 'Data Science', description: 'Machine learning and data analysis', icon: 'fa-chart-pie', color: '#10b981' },
      { name: 'Design', description: 'UI/UX and Graphic Design', icon: 'fa-pen-nib', color: '#ec4899' },
      { name: 'Marketing', description: 'Digital marketing and SEO', icon: 'fa-bullhorn', color: '#f59e0b' }
    ]);

    console.log('Seeding Teachers...');
    const teacher1 = await Teacher.create({
      name: 'Dr. Alan Turing',
      email: 'alan@lms.com',
      password: 'password123',
      specialization: 'Computer Science',
      approvalStatus: 'approved',
      bio: 'Pioneer of theoretical computer science.',
      earnings: 50000
    });

    const teacher2 = await Teacher.create({
      name: 'Ada Lovelace',
      email: 'ada@lms.com',
      password: 'password123',
      specialization: 'Programming',
      approvalStatus: 'approved',
      bio: 'First computer programmer.',
      earnings: 45000
    });

    console.log('Seeding Courses...');
    const course1 = await Course.create({
      title: 'Fullstack Next.js Bootcamp',
      description: 'Master React, Next.js, and Node.js from scratch.',
      category: categories[0]._id,
      teacher: teacher1._id,
      price: 4999,
      duration: '40 hours',
      level: 'intermediate',
      status: 'published',
      tags: ['react', 'nextjs', 'node']
    });

    const course2 = await Course.create({
      title: 'Python for Data Science',
      description: 'Learn Pandas, NumPy, and Scikit-Learn.',
      category: categories[1]._id,
      teacher: teacher2._id,
      price: 3499,
      duration: '25 hours',
      level: 'beginner',
      status: 'published',
      tags: ['python', 'data science', 'machine learning']
    });

    // Update teachers with assigned courses
    await Teacher.findByIdAndUpdate(teacher1._id, { $push: { assignedCourses: course1._id } });
    await Teacher.findByIdAndUpdate(teacher2._id, { $push: { assignedCourses: course2._id } });

    console.log('Seeding Students...');
    const students = await Student.insertMany([
      { name: 'Rahul Sharma', email: 'rahul@example.com', password: await bcrypt.hash('password123', 12), phone: '9876543210' },
      { name: 'Priya Patel', email: 'priya@example.com', password: await bcrypt.hash('password123', 12), phone: '9876543211' },
      { name: 'Amit Singh', email: 'amit@example.com', password: await bcrypt.hash('password123', 12), phone: '9876543212' }
    ]);

    console.log('Seeding Enrollments...');
    await Enrollment.create([
      { student: students[0]._id, course: course1._id, progress: 45, amountPaid: 4999 },
      { student: students[1]._id, course: course1._id, progress: 100, status: 'completed', amountPaid: 4999, completedAt: new Date() },
      { student: students[2]._id, course: course2._id, progress: 10, amountPaid: 3499 }
    ]);

    console.log('Seeding Activities...');
    await Activity.insertMany([
      { type: 'course_created', message: 'New course "Fullstack Next.js Bootcamp" created', icon: 'fa-book-open', color: 'indigo' },
      { type: 'student_registered', message: 'Rahul Sharma joined the platform', icon: 'fa-user-graduate', color: 'blue' },
      { type: 'enrollment', message: 'Priya Patel enrolled in Fullstack Next.js Bootcamp', icon: 'fa-cart-shopping', color: 'emerald' },
      { type: 'course_completed', message: 'Priya Patel completed Fullstack Next.js Bootcamp', icon: 'fa-trophy', color: 'amber' }
    ]);

    console.log('✅ Seeding Complete!');
    console.log('-------------------------------------------');
    console.log('Admin Email: admin@lms.com');
    console.log('Admin Password: password123');
    console.log('-------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
