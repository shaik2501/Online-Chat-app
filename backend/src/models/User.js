import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
   fullName:{
    type:String,
    required:true,
   },
   email:{
    type:String,
    required:true,
    unique:true,
   },
   password:{
    type:String,
    required:true,
    minlength:6,
   },
   bio:{
    type:String,
    default:"",
   },
   profilePic:{
    type:String,
    default:"https://avatar.iran.liara.run/public/1.png",
   },
   nativeLanguage:{
    type:String,
    default:"",
   },
   learningLanguage:{
    type:String,
    default:"",
   },
   location:{
    type:String,
    default:"",
   },
   isOnboarded:{
    type:Boolean,
    default:false,
   },
   
   friends:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
   }]

},{timestamps:true});
//createdAp , upadatedAt

//pre hook to hash password before saving user
userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
       this.password = await bcrypt.hash(this.password,salt);
         next();
    }catch(error){
        next(error);
    }
});

//method to match entered password with hashed password in the database
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model('User',userSchema);

//pre hook



export default User;