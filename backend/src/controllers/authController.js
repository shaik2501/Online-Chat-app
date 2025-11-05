import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { upsertStreamUser } from '../lib/stream.js';


//Sign Up function
export async function signup(req, res) {

  //retrieve data from request body
  const { fullName, email, password } = req.body;

//validation checking if the body fields are present and valid
try{
  if(!fullName || !email || !password){
    return res.status(400).json({message:'Please provide all required fields'});
  }

  //checking password length
  if(password.length < 6){
    return res.status(400).json({message:'Password must be at least 6 characters long'});
  } 

  //validating email format like is it @gmail format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    return res.status(400).json({message:'Please provide a valid email address'});
}

//checking if user with the same email already exists
const existingUser = await User.findOne({email});
if(existingUser){
  return res.status(400).json({message:'Email is already registered,use another email'});
}

// this is to generate random avatar for user with index from 1 to 100
const idx = Math.floor(Math.random() * 100)+1;
const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

const newUser = await User.create({
  fullName,
  email,
  password,
  profilePic:randomAvatar,
})


//this is for creating a user in Stream Chat platform
try{
  await upsertStreamUser({
  id:newUser._id.toString(),
  name:newUser.fullName,
  email:newUser.email,
  image:newUser.profilePic || "",
});
console.log(`User synced with Stream successfully ${newUser._id}`);
}catch(error){
  console.error('Error syncing user with Stream:',error);
}

// this is  creatinfg jwt token for user authentication
const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'})

//setting cookie in response
res.cookie('jwt', token, {
  httpOnly: true,
  secure: true,        // must be true for HTTPS
  sameSite: 'None',    // allows cross-origin
  maxAge: 7*24*60*60*1000,
});


//fina;ly sending response back to client
res.status(201).json({success:true,message:'User registered successfully',user:{
  id:newUser._id,
  fullName:newUser.fullName,
}})

}
catch(error){
  console.error('Error during signup controller:',error);
  res.status(500).json({message:'Internal Server Error'});
}
}


// Login Function
export async function login(req,res){

//retrieving email and password from request body
  try{
    const {email,password} = req.body
    //check the if it is empty or not
    if(!email||!password){
      return res.status(400).json({message:"Please provide the credentials"});
    }

  //checking if user with the email exists
    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({message:"Invalid email"});
    }

    //checking if password matches
    const isPasswordValid = await user.matchPassword(password);
    if(!isPasswordValid){
      return res.status(401).json({message:"Invalid password"});
    }

   // this is  creatinfg jwt token for user authentication
const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'})

//setting cookie in response
// 🔴 FIX APPLIED HERE: Changed sameSite from 'strict' to 'None' and set secure: true
res.cookie('jwt',token,{
  httpOnly:true,
  sameSite:'None', // FIX: Necessary for cross-site cookie sending (client to API)
  secure:true, // FIX: Must be true when sameSite is 'None'
  maxAge:7*24*60*60*1000,//7 days)
})

res.status(200).json({success:true,message:"Login succesfull",user});

  }catch(error){
    console.error('Error during login controller:',error);
    res.status(500).json({message:'Internal Server Error'});
}
}


//Logout function
export async function logout(req,res){
  res.clearCookie('jwt')
  res.status(200).json({success:true,message:"Logged out successfully"});
}

//onboarding function
// Onboarding function
export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

    // ✅ Validation
    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: 'Please provide all required fields',
        missingFields: [
          !fullName && 'fullName',
          !bio && 'bio',
          !nativeLanguage && 'nativeLanguage',
          !learningLanguage && 'learningLanguage',
          !location && 'location',
        ].filter(Boolean),
      });
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        profilePic,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Update Stream user
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        email: updatedUser.email,
        image: updatedUser.profilePic || '',
      });
      console.log(`Stream user updated for onboarding: ${updatedUser._id}`);
    } catch (streamError) {
      console.error('Error updating Stream user during onboarding:', streamError.message);
    }

    // ✅ ✅ Send response (THIS WAS MISSING)
    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error during onboarding controller:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}