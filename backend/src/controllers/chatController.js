import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export const getStreamToken = async (req, res) => {
  try {
    // Make sure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create a Stream Chat token for this user
    const userId = req.user._id.toString();
    const token = streamClient.createToken(userId);

    console.log("✅ Stream token created for:", userId);
    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error creating Stream token:", error);
    res.status(500).json({ message: "Failed to create Stream token" });
  }
};
