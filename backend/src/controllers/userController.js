import User from '../models/User.js';
import FriendRequest from '../models/FriendRequet.js';

//creating a function
export async function getRecommendedUsers(req, res) {
  try {

    //taking the users 
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true }
      ]
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export async function getMyFriends(req,res){
      try{
        const user = await User.findById(req.user.id).select('friends').populate('friends','fullName profilePic nativeLanguage learningLanguage location');
        res.status(200).json(user.friends);
      }catch(error){
        console.error("Error fetching friends:", error);
        res.status(500).json({success:false,message:"Internal Server Error"});
      }
}


export async function sendFriendRequest(req,res){
   try{

    //get my id and recipent id
        const myId = req.user.id;
        const {id:recipentId} = req.params

        //prevent sending request to oneself
        if(myId===recipentId){
            return res.status(400).json({success:false,message:"You cannot send friend request to yourself"});
        }

        //check if recipent exists
        const recipent =  await User.findById(recipentId);
        if(!recipent){
            return res.status(404).json({success:false,message:"Recipent user not found"});
        }
        
        //check if they are already friends
        if(recipent.friends.includes(myId)){
            return res.status(400).json({success:false,message:"User is already your friend"});
        }

        //check if a friend request is already sent
        const existingRequest =  await FriendRequest.findOne({
            $or:[
                {sender:myId,recipent:recipentId},
                {sender:recipentId,recipent:myId}
            ]
        })

        if(existingRequest){
            return res.status(400).json({success:false,message:"Friend request already exists"});
        }

        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipent:recipentId,
        });

        res.status(201).json({success:true,message:"Friend request sent",friendRequest});
    
   }catch(error){
    console.error("Error sending friend request:", error);
    res.status(500).json({success:false,message:"Internal Server Error"});
   }
}


export async function acceptFriendRequest(req,res){
   try{

    //get request id from params
     const {id:requestId} = req.params;
     const friendRequest = await FriendRequest.findById(requestId);

     //check if friend request exists
     if(!friendRequest){
        return res.status(404).json({success:false,message:"Friend request not found"});
     }

    //check if the logged in user is the recipent of the friend request
     if(friendRequest.recipent.toString() !== req.user.id){
        return res.status(403).json({success:false,message:"You are not authorized to accept this friend request"});
     }

      friendRequest.status = 'accepted';
      await friendRequest.save();


      //addtoSet to avoid duplicate entries
      //add each other to friends list
      await User.findByIdAndUpdate(friendRequest.sender,{
        $addToSet:{friends:friendRequest.recipent}
      });

      //add to recipent's friends list
        await User.findByIdAndUpdate(friendRequest.recipent,{   
        $addToSet:{friends:friendRequest.sender}
      });

        res.status(200).json({success:true,message:"Friend request accepted"});

   }catch(error){
    console.error("Error accepting friend request:", error);
    res.status(500).json({success:false,message:"Internal Server Error"});
   }
}

// Example backend function
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const incomingRequests = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    })
      .populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    })
      .populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export async function getOutgoingFriendRequests(req,res){
  try{
         const outgoingRequests = await FriendRequest.find({
        sender:req.user.id, // Finds requests where the logged-in user is the sender
        status:'pending'
     }).populate('recipient','fullName profilePic nativeLanguage learningLanguage');

     res.status(200).json(outgoingRequests);
    }catch(error){
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}