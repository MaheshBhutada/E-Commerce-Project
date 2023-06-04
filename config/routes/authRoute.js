import express from 'express'
import {registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrderController, getAllOrderController, orderStatusController} from '../controllers/authController.js'
import {isAdmin, requireSignIn } from '../middleware/authMiddleware.js'


// if u write routing in separate file u should create an object.
const router = express.Router();

// here we use mvc pattern, for that registercontroller function is craete in another file.

router.post('/register',registerController) // register // method Post.

router.post('/login', loginController)  // login // method post

router.get('/test', requireSignIn, isAdmin, testController);   // dumi route for test.


// Forget Password || POST.
router.post('/forgot-password', forgotPasswordController);


// protected User route auth .
router.get('/user-auth',requireSignIn, (req,res) => {
    res.status(200).send({ok: true});
})

// protected Admin route auth.
router.get('/admin-auth',requireSignIn,isAdmin, (req,res) => {
    res.status(200).send({ok: true});
})

// update user profile.
router.put("/profile", requireSignIn, updateProfileController);

// orders.
router.get('/orders', requireSignIn, getOrderController);

//All orders.
router.get('/all-orders', requireSignIn, isAdmin,  getAllOrderController);

// order status update.
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

export default router;