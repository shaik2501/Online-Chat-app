import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
  throw new Error('Stream API key and secret must be provided in environment variables');
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData)=>{
    try{
       await streamClient.upsertUser(userData);

    return userData;
    }catch(error){
        console.error('Error creating Stream user:',error);
        throw error;
    }
};


export const generateStreamToken = (userId)=>{
    try{
           //ensure user exists is a String
           const userIdStr = userId.toString();
           return streamClient.createToken(userIdStr);
    }catch(error){
        console.error('Error generating Stream token:',error);
        throw error;
    }
}