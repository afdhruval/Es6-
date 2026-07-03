const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const Activity = require('../models/Activity');
const bcrypt = require('bcryptjs');

const ITEMS_PER_PAGE = 10;

// GET /students
exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const statusFilter = req.query.status || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (statusFilter) query.status = statusFilter;

    const total = await Student.countDocuments(query);
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render('students/index', {
      title: 'Students',
      students,
      currentPage: page,
      totalPages,
      total,
      search,
      statusFilter
    });
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to load students.']);
    res.redirect('/dashboard');
  }
};

// GET /students/create
exports.getCreate = (req, res) => {
  res.render('students/create', { title: 'Add Student' });
};

// POST /students/create
exports.postCreate = async (req, res) => {
  const { name, email, password, phone, bio } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required.');
  if (!email || !email.includes('@')) errors.push('Valid email is required.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');

  if (errors.length) {
    req.flash('error', errors);
    return res.redirect('/students/create');
  }

  try {
    const existing = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash('error', ['A student with this email already exists.']);
      return res.redirect('/students/create');
    }

    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    const student = new Student({ name: name.trim(), email: email.toLowerCase().trim(), password, phone: phone || '', bio: bio || '', avatar });
    await student.save();

    await Activity.create({
      type: 'student_registered',
      message: `New student ${student.name} registered`,
      icon: 'fa-user-graduate',
      color: 'blue'
    });

    req.flash('success', [`Student "${student.name}" created successfully.`]);
    res.redirect('/students');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to create student.']);
    res.redirect('/students/create');
  }
};

// GET /students/:id
exports.show = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      req.flash('error', ['Student not found.']);
      return res.redirect('/students');
    }

    const enrollments = await Enrollment.find({ student: student._id })
      .populate('course', 'title thumbnail status price');

    res.render('students/show', { title: student.name, student, enrollments });
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to load student.']);
    res.redirect('/students');
  }
};

// GET /students/:id/edit
exports.getEdit = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      req.flash('error', ['Student not found.']);
      return res.redirect('/students');
    }
    res.render('students/edit', { title: `Edit ${student.name}`, student });
  } catch (err) {
    req.flash('error', ['Failed to load student.']);
    res.redirect('/students');
  }
};

// POST /students/:id  (handles update, delete, suspend, activate, reset-password via _action)
exports.handleAction = async (req, res) => {
  const { _action } = req.body;
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    if (!student) {
      req.flash('error', ['Student not found.']);
      return res.redirect('/students');
    }

    if (_action === 'update') {
      const { name, email, phone, bio } = req.body;
      const errors = [];
      if (!name || !name.trim()) errors.push('Name is required.');
      if (!email || !email.includes('@')) errors.push('Valid email required.');
      if (errors.length) {
        req.flash('error', errors);
        return res.redirect(`/students/${id}/edit`);
      }

      // Check email uniqueness (excluding self)
      const existing = await Student.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
      if (existing) {
        req.flash('error', ['Email already in use by another student.']);
        return res.redirect(`/students/${id}/edit`);
      }

      student.name = name.trim();
      student.email = email.toLowerCase().trim();
      student.phone = phone || '';
      student.bio = bio || '';
      if (req.file) student.avatar = `/uploads/${req.file.filename}`;
      await student.save();
      req.flash('success', [`Student "${student.name}" updated successfully.`]);
      return res.redirect('/students');

    } else if (_action === 'delete') {
      await Enrollment.deleteMany({ student: id });
      await Student.findByIdAndDelete(id);
      req.flash('success', ['Student deleted successfully.']);
      return res.redirect('/students');

    } else if (_action === 'suspend') {
      student.status = 'suspended';
      await student.save();
      req.flash('success', [`Student "${student.name}" has been suspended.`]);
      return res.redirect('/students');

    } else if (_action === 'activate') {
      student.status = 'active';
      await student.save();
      req.flash('success', [`Student "${student.name}" has been activated.`]);
      return res.redirect('/students');

    } else if (_action === 'reset-password') {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        req.flash('error', ['New password must be at least 6 characters.']);
        return res.redirect(`/students/${id}`);
      }
      student.password = newPassword;
      await student.save();
      req.flash('success', [`Password for "${student.name}" reset successfully.`]);
      return res.redirect(`/students/${id}`);
    }

    req.flash('error', ['Unknown action.']);
    res.redirect('/students');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Action failed. Please try again.']);
    res.redirect('/students');
  }
};
