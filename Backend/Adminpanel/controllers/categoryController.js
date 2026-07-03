const Category = require('../models/Category');
const Course = require('../models/Course');

// GET /categories
exports.index = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
      const courseCount = await Course.countDocuments({ category: cat._id });
      return { ...cat.toObject(), courseCount };
    }));
    res.render('categories/index', { title: 'Categories', categories: categoriesWithCount });
  } catch (err) {
    req.flash('error', ['Failed to load categories.']);
    res.redirect('/dashboard');
  }
};

// POST /categories/create
exports.create = async (req, res) => {
  const { name, description, icon, color } = req.body;
  const errors = [];
  if (!name || !name.trim()) errors.push('Category name is required.');
  if (errors.length) {
    req.flash('error', errors);
    return res.redirect('/categories');
  }

  try {
    const existing = await Category.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' } });
    if (existing) {
      req.flash('error', ['A category with this name already exists.']);
      return res.redirect('/categories');
    }
    await Category.create({
      name: name.trim(),
      description: description || '',
      icon: icon || 'fa-book',
      color: color || '#6366f1'
    });
    req.flash('success', [`Category "${name.trim()}" created.`]);
    res.redirect('/categories');
  } catch (err) {
    req.flash('error', ['Failed to create category.']);
    res.redirect('/categories');
  }
};

// POST /categories/:id
exports.handleAction = async (req, res) => {
  const { _action } = req.body;
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      req.flash('error', ['Category not found.']);
      return res.redirect('/categories');
    }

    if (_action === 'update') {
      const { name, description, icon, color, status } = req.body;
      if (!name || !name.trim()) {
        req.flash('error', ['Category name is required.']);
        return res.redirect('/categories');
      }
      category.name = name.trim();
      category.description = description || '';
      category.icon = icon || 'fa-book';
      category.color = color || '#6366f1';
      category.status = status || 'active';
      await category.save();
      req.flash('success', [`Category "${category.name}" updated.`]);
      return res.redirect('/categories');

    } else if (_action === 'delete') {
      const courseCount = await Course.countDocuments({ category: id });
      if (courseCount > 0) {
        req.flash('error', [`Cannot delete: ${courseCount} course(s) are assigned to this category.`]);
        return res.redirect('/categories');
      }
      await Category.findByIdAndDelete(id);
      req.flash('success', ['Category deleted successfully.']);
      return res.redirect('/categories');

    } else if (_action === 'toggle-status') {
      category.status = category.status === 'active' ? 'inactive' : 'active';
      await category.save();
      req.flash('success', [`Category status changed to ${category.status}.`]);
      return res.redirect('/categories');
    }

    req.flash('error', ['Unknown action.']);
    res.redirect('/categories');
  } catch (err) {
    req.flash('error', ['Action failed.']);
    res.redirect('/categories');
  }
};
