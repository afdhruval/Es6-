const Course = require('../models/Course');
const Category = require('../models/Category');
const Teacher = require('../models/Teacher');
const Enrollment = require('../models/Enrollment');
const Activity = require('../models/Activity');

const ITEMS_PER_PAGE = 10;

// GET /courses
exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const categoryFilter = req.query.category || '';
    const statusFilter = req.query.status || '';
    const levelFilter = req.query.level || '';

    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (categoryFilter) query.category = categoryFilter;
    if (statusFilter) query.status = statusFilter;
    if (levelFilter) query.level = levelFilter;

    const total = await Course.countDocuments(query);
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const courses = await Course.find(query)
      .populate('category', 'name color')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const categories = await Category.find({ status: 'active' });

    res.render('courses/index', {
      title: 'Courses',
      courses,
      categories,
      currentPage: page,
      totalPages,
      total,
      search,
      categoryFilter,
      statusFilter,
      levelFilter
    });
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to load courses.']);
    res.redirect('/dashboard');
  }
};

// GET /courses/create
exports.getCreate = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' });
    const teachers = await Teacher.find({ approvalStatus: 'approved', status: 'active' });
    res.render('courses/create', { title: 'Add Course', categories, teachers });
  } catch (err) {
    req.flash('error', ['Failed to load form data.']);
    res.redirect('/courses');
  }
};

// POST /courses/create
exports.postCreate = async (req, res) => {
  const { title, description, category, teacher, price, duration, level, status, tags } = req.body;
  const errors = [];

  if (!title || !title.trim()) errors.push('Title is required.');
  if (!category) errors.push('Category is required.');

  if (errors.length) {
    req.flash('error', errors);
    return res.redirect('/courses/create');
  }

  try {
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
    const course = new Course({
      title: title.trim(),
      description: description || '',
      category,
      teacher: teacher || null,
      price: parseFloat(price) || 0,
      duration: duration || '',
      level: level || 'beginner',
      status: status || 'draft',
      thumbnail,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []
    });
    await course.save();

    if (teacher) {
      await Teacher.findByIdAndUpdate(teacher, { $addToSet: { assignedCourses: course._id } });
    }

    await Activity.create({
      type: 'course_created',
      message: `New course "${course.title}" created`,
      icon: 'fa-book-open',
      color: 'indigo'
    });

    req.flash('success', [`Course "${course.title}" created successfully.`]);
    res.redirect('/courses');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to create course.']);
    res.redirect('/courses/create');
  }
};

// GET /courses/:id/edit
exports.getEdit = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      req.flash('error', ['Course not found.']);
      return res.redirect('/courses');
    }
    const categories = await Category.find({ status: 'active' });
    const teachers = await Teacher.find({ approvalStatus: 'approved', status: 'active' });
    res.render('courses/edit', { title: `Edit: ${course.title}`, course, categories, teachers });
  } catch (err) {
    req.flash('error', ['Failed to load course.']);
    res.redirect('/courses');
  }
};

// POST /courses/:id
exports.handleAction = async (req, res) => {
  const { _action } = req.body;
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      req.flash('error', ['Course not found.']);
      return res.redirect('/courses');
    }

    if (_action === 'update') {
      const { title, description, category, teacher, price, duration, level, status, tags } = req.body;
      const errors = [];
      if (!title || !title.trim()) errors.push('Title is required.');
      if (!category) errors.push('Category is required.');
      if (errors.length) {
        req.flash('error', errors);
        return res.redirect(`/courses/${id}/edit`);
      }

      course.title = title.trim();
      course.description = description || '';
      course.category = category;
      course.teacher = teacher || null;
      course.price = parseFloat(price) || 0;
      course.duration = duration || '';
      course.level = level || 'beginner';
      course.status = status || 'draft';
      course.tags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      if (req.file) course.thumbnail = `/uploads/${req.file.filename}`;
      await course.save();
      req.flash('success', [`Course "${course.title}" updated.`]);
      return res.redirect('/courses');

    } else if (_action === 'delete') {
      await Enrollment.deleteMany({ course: id });
      await Course.findByIdAndDelete(id);
      req.flash('success', ['Course deleted successfully.']);
      return res.redirect('/courses');

    } else if (_action === 'publish') {
      course.status = 'published';
      await course.save();
      req.flash('success', [`Course "${course.title}" published.`]);
      return res.redirect('/courses');

    } else if (_action === 'unpublish') {
      course.status = 'draft';
      await course.save();
      req.flash('success', [`Course "${course.title}" unpublished.`]);
      return res.redirect('/courses');
    }

    req.flash('error', ['Unknown action.']);
    res.redirect('/courses');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Action failed.']);
    res.redirect('/courses');
  }
};
