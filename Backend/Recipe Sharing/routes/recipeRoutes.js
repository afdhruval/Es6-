const { Router } = require('express');
const recipeController = require('../controllers/recipeController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', recipeController.recipe_list_get);
router.get('/recipes', recipeController.recipe_list_get);
router.get('/my-recipes', requireAuth, recipeController.my_recipes_get);
router.get('/recipes/new', requireAuth, recipeController.recipe_create_get);
router.post('/recipes', requireAuth, recipeController.recipe_create_post);
router.get('/recipes/:id', requireAuth, recipeController.recipe_details_get);
router.post('/recipes/:id/comments', requireAuth, recipeController.recipe_comment_post);

module.exports = router;
