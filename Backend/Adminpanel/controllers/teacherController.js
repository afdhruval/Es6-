const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Activity = require('../models/Activity');

const ITEMS_PER_PAGE = 10;

// GET /teachers
exports.index = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const statusFilter = req.query.status || '';
    const approvalFilter = req.query.approval || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    if (statusFilter) query.status = statusFilter;
    if (approvalFilter) query.approvalStatus = approvalFilter;

    const total = await Teacher.countDocuments(query);
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const teachers = await Teacher.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    // Enrich with course count
    const teachersWithStats = await Promise.all(teachers.map(async (teacher) => {
      const courseCount = await Course.countDocuments({ teacher: teacher._id });
      return { ...teacher.toObject(), courseCount };
    }));

    res.render('teachers/index', {
      title: 'Teachers',
      teachers: teachersWithStats,
      currentPage: page,
      totalPages,
      total,
      search,
      statusFilter,
      approvalFilter
    });
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to load teachers.']);
    res.redirect('/dashboard');
  }
};

// GET /teachers/create
exports.getCreate = (req, res) => {
  res.render('teachers/create', { title: 'Add Teacher' });
};

// POST /teachers/create
exports.postCreate = async (req, res) => {
  const { name, email, password, phone, bio, specialization } = req.body;
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required.');
  if (!email || !email.includes('@')) errors.push('Valid email is required.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');

  if (errors.length) {
    req.flash('error', errors);
    return res.redirect('/teachers/create');
  }

  try {
    const existing = await Teacher.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      req.flash('error', ['A teacher with this email already exists.']);
      return res.redirect('/teachers/create');
    }

    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    const teacher = new Teacher({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      bio: bio || '',
      specialization: specialization || '',
      avatar,
      approvalStatus: 'approved'
    });
    await teacher.save();

    await Activity.create({
      type: 'teacher_registered',
      message: `New teacher ${teacher.name} added`,
      icon: 'fa-chalkboard-teacher',
      color: 'purple'
    });

    req.flash('success', [`Teacher "${teacher.name}" created successfully.`]);
    res.redirect('/teachers');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to create teacher.']);
    res.redirect('/teachers/create');
  }
};

// GET /teachers/:id
exports.show = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      req.flash('error', ['Teacher not found.']);
      return res.redirect('/teachers');
    }

    const courses = await Course.find({ teacher: teacher._id }).populate('category', 'name');
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courses.map(c => c._id) }
    });

    res.render('teachers/show', {
      title: teacher.name,
      teacher,
      courses,
      totalStudents
    });
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to load teacher.']);
    res.redirect('/teachers');
  }
};

// GET /teachers/:id/edit
exports.getEdit = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      req.flash('error', ['Teacher not found.']);
      return res.redirect('/teachers');
    }
    const courses = await Course.find({ teacher: { $ne: req.params.id } }).populate('category', 'name');
    res.render('teachers/edit', { title: `Edit ${teacher.name}`, teacher, courses });
  } catch (err) {
    req.flash('error', ['Failed to load teacher.']);
    res.redirect('/teachers');
  }
};

// POST /teachers/:id
exports.handleAction = async (req, res) => {
  const { _action } = req.body;
  const { id } = req.params;

  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      req.flash('error', ['Teacher not found.']);
      return res.redirect('/teachers');
    }

    if (_action === 'update') {
      const { name, email, phone, bio, specialization } = req.body;
      const errors = [];
      if (!name || !name.trim()) errors.push('Name is required.');
      if (!email || !email.includes('@')) errors.push('Valid email required.');
      if (errors.length) {
        req.flash('error', errors);
        return res.redirect(`/teachers/${id}/edit`);
      }

      const existing = await Teacher.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
      if (existing) {
        req.flash('error', ['Email already in use.']);
        return res.redirect(`/teachers/${id}/edit`);
      }

      teacher.name = name.trim();
      teacher.email = email.toLowerCase().trim();
      teacher.phone = phone || '';
      teacher.bio = bio || '';
      teacher.specialization = specialization || '';
      if (req.file) teacher.avatar = `/uploads/${req.file.filename}`;
      await teacher.save();
      req.flash('success', [`Teacher "${teacher.name}" updated successfully.`]);
      return res.redirect('/teachers');

    } else if (_action === 'delete') {
      await Course.updateMany({ teacher: id }, { teacher: null });
      await Teacher.findByIdAndDelete(id);
      req.flash('success', ['Teacher deleted successfully.']);
      return res.redirect('/teachers');

    } else if (_action === 'suspend') {
      teacher.status = 'suspended';
      await teacher.save();
      req.flash('success', [`Teacher "${teacher.name}" suspended.`]);
      return res.redirect('/teachers');

    } else if (_action === 'activate') {
      teacher.status = 'active';
      await teacher.save();
      req.flash('success', [`Teacher "${teacher.name}" activated.`]);
      return res.redirect('/teachers');

    } else if (_action === 'approve') {
      teacher.approvalStatus = 'approved';
      teacher.status = 'active';
      await teacher.save();
      await Activity.create({
        type: 'teacher_approved',
        message: `Teacher ${teacher.name} was approved`,
        icon: 'fa-check-circle',
        color: 'green'
      });
      req.flash('success', [`Teacher "${teacher.name}" approved.`]);
      return res.redirect('/teachers');

    } else if (_action === 'reject') {
      teacher.approvalStatus = 'rejected';
      await teacher.save();
      await Activity.create({
        type: 'teacher_rejected',
        message: `Teacher ${teacher.name} was rejected`,
        icon: 'fa-times-circle',
        color: 'red'
      });
      req.flash('success', [`Teacher "${teacher.name}" rejected.`]);
      return res.redirect('/teachers');

    } else if (_action === 'assign-course') {
      const { courseId } = req.body;
      if (!courseId) {
        req.flash('error', ['Please select a course to assign.']);
        return res.redirect(`/teachers/${id}`);
      }
      await Course.findByIdAndUpdate(courseId, { teacher: id });
      if (!teacher.assignedCourses.includes(courseId)) {
        teacher.assignedCourses.push(courseId);
        await teacher.save();
      }
      req.flash('success', ['Course assigned successfully.']);
      return res.redirect(`/teachers/${id}`);

    } else if (_action === 'reset-password') {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        req.flash('error', ['Password must be at least 6 characters.']);
        return res.redirect(`/teachers/${id}`);
      }
      teacher.password = newPassword;
      await teacher.save();
      req.flash('success', ['Password reset successfully.']);
      return res.redirect(`/teachers/${id}`);
    }

    req.flash('error', ['Unknown action.']);
    res.redirect('/teachers');
  } catch (err) {
    console.error(err);
    req.flash('error', ['Action failed. Please try again.']);
    res.redirect('/teachers');
  }
};
