const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const Category = require('../models/Category');
const Enrollment = require('../models/Enrollment');
const Activity = require('../models/Activity');

exports.index = async (req, res) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      totalCategories,
      activeCourses,
      pendingTeachers,
      activeStudents,
      enrollments,
      recentActivities,
      recentEnrollments
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Course.countDocuments(),
      Category.countDocuments(),
      Course.countDocuments({ status: 'published' }),
      Teacher.countDocuments({ approvalStatus: 'pending' }),
      Student.countDocuments({ status: 'active' }),
      Enrollment.countDocuments(),
      Activity.find().sort({ createdAt: -1 }).limit(8),
      Enrollment.find()
        .populate('student', 'name email avatar')
        .populate('course', 'title price')
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

    // Revenue calculation
    const revenueData = await Enrollment.aggregate([
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Completion rate
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    const completionRate = enrollments > 0 ? Math.round((completedEnrollments / enrollments) * 100) : 0;

    // New registrations this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newRegistrations = await Student.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.render('dashboard/index', {
      title: 'Dashboard',
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalCategories,
        activeCourses,
        pendingTeachers,
        activeStudents,
        totalRevenue,
        completionRate,
        newRegistrations,
        totalEnrollments: enrollments
      },
      recentActivities,
      recentEnrollments
    });
  } catch (err) {
    console.error(err);
    req.flash('error', ['Failed to load dashboard data.']);
    res.render('dashboard/index', {
      title: 'Dashboard',
      stats: {},
      recentActivities: [],
      recentEnrollments: []
    });
  }
};
