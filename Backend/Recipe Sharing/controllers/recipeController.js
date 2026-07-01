const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Comment = require('../models/Comment');

module.exports.recipe_list_get = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'username').sort({ createdAt: -1 });
    res.render('recipeList', { title: 'All Recipes', recipes });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

module.exports.my_recipes_get = async (req, res) => {
  try {
    // Populate is requested by prompt
    const user = await User.findById(req.user.id).populate('recipes');
    res.render('myRecipes', { title: 'My Recipes', recipes: user.recipes });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

module.exports.recipe_create_get = (req, res) => {
  res.render('recipeForm', { title: 'Create Recipe', recipe: null });
};

module.exports.recipe_create_post = async (req, res) => {
  const { title, ingredients, instructions, imageUrl } = req.body;
  
  try {
    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      imageUrl: imageUrl || undefined,
      author: req.user.id,
    });

    // Update user's recipes array
    await User.findByIdAndUpdate(req.user.id, { $push: { recipes: recipe._id } });

    res.redirect('/my-recipes');
  } catch (err) {
    console.log(err);
    res.status(400).send('Error creating recipe');
  }
};

module.exports.recipe_details_get = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' },
        options: { sort: { createdAt: -1 } }
      });
    
    if (!recipe) return res.status(404).send('Recipe not found');
    
    res.render('recipeItem', { title: recipe.title, recipe });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

module.exports.recipe_comment_post = async (req, res) => {
  const { text } = req.body;
  try {
    const comment = await Comment.create({
      text,
      author: req.user.id,
      recipe: req.params.id
    });
    
    await Recipe.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
    
    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.status(400).send('Error adding comment');
  }
};
