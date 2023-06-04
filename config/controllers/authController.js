import userModel from "../models/userModel.js"
import orderModel from "../models/OrderModel.js"

import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req,res) => {
    try{
        const {name,email,password,phone,address,answer} = req.body

        //validations.
        if(!name){
            return res.send({message:"Name is required"});
        }
        if(!email){
            return res.send({message:"Email is required"});
        }
        if(!password){
            return res.send({message:"password is required"});
        }
        if(!phone){
            return res.send({message:"Phone Number is required"});
        }
        if(!address){
            return res.send({message:'address is required for Product delivery'})
        }
        if(!answer){
            return res.send({message:'answer is required for Password Reset'})
        }

        // check user for same email address exist.
        const exisitingUser = await userModel.findOne({email})

        // check for excisting user(it means if exisit the run this).
        if(exisitingUser){
            return res.status(200).send({
                success:false,
                message:'Already register please login'
            })
        }

        //register user.
        const HashedPassword = await hashPassword(password);

        // save details.
        const user = await new userModel({
            name,email,phone,address,
            password:HashedPassword,
            answer
        }).save();

        // send a response of success.
        res.status(201).send({
            success:true,
            message: 'User Register Successfully',
            user
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in Registeration',
            error
        })
    }
}

// POST LOGIN .
export const loginController =async (req,res) => {
    try{
         const {email,password} = req.body;
         
         // validation.
         if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
         }

         //check user.
         const user = await userModel.findOne({email:email})

        if(!user){
            return res.status(404).send({
                success:false,
                message:' Email is not registerd'
            })
        }
         const match = await comparePassword(password,user.password);

        if(!match){
            return res.status(200).send({   // here we add 200 because email is correct just password is wrong.
                success:false,
                message:'Invalid Password',
            })
        }

        // create JWT token.
        const token = JWT.sign({_id: user._id }, process.env.JWT_SECRET, {
            expiresIn:"7d",
        });

        //response send.
        res.status(200).send({
            success:true,
            message:"User login",
            token,
            user:{
                email:req.body.email,
                name:user.name,
                phone:user.phone,
                address:user.address,
                role:user.role
            }
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })
    }
};

// forgotPasswordController.
export const forgotPasswordController = async (req,res) => {
    try{
        const {email,answer,newPassword} = req.body;
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'newPassword is required'})
        }

        // check for user.
        const user = await userModel.findOne({email,answer})

        //validation.
        if(!user){
            return res.status(400),send({
                success: false,
                message: 'Wrong Email or answer'
            })
        }

        // hashed the newpassword of user.
        const hashed = await hashPassword(newPassword);

        // update the new password in dataset.
        await userModel.findByIdAndUpdate(user._id,{password:hashed});

        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully',
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message: 'Somthing went wrong',
            error
        })
    }
}


// test controller.
export const testController = (req,res)=>{
    return res.send('Protected Route');
}

// Update User Profile.
export const updateProfileController = async (req,res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);

        //password.

        if (password && password.length < 6) 
        {
            return res.json({ error: "Passsword is required and 6 character long,contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character" });
        }

        // hash new passw0rd.

        const hashedPassword = password ? await hashPassword(password) : undefined;


        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } 
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error While Update profile",
            error,
        });
    }
};

// user order's

export const getOrderController = async (req,res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer","name");
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while Geting Orders",
            error,
        });
    }
}

//all Order's.

export const getAllOrderController = async (req,res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
}

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};