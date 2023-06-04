import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true, //it remove all the whitespace.
    },
    email:{
        type:String,
        required:'Please enter your email',
        unique:true,
    },
    password: {
        type: String,
        required: true,
        unique:true
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    answer: {
        type: {},
        required: true
    },
    role: {
        type: Number,
        default : 0, // 0->false. 1->true.
    }
},{timestamps: true});
// timestamps -> whenever a new user is create automatically time is added.


export default mongoose.model('users',userSchema);