import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';
import { categoryControlller, createCategoryController, deleteCategoryCOntroller, singleCategoryController, updateCategoryController } from '../controllers/createCategoryController.js';

const  router = express.Router();

//routes.

// create new category.
router.post('/create-category', requireSignIn, isAdmin, createCategoryController);

// update category.
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController);

// getAll category.
router.get('/get-category', categoryControlller);

// Single category.
router.get('/single-category/:slug', singleCategoryController);

// delete category.
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryCOntroller);

export default router;