import mongoose from "mongoose";
import dotenv from "dotenv";
import FriendRequest from "./FriendRequet.js"; // ✅ correct spelling

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your_database_name";

const fixFriendRequests = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Step 1: Find how many have 'recipent'
    const wrongDocs = await FriendRequest.find({ recipent: { $exists: true } });
    console.log(`🕵️ Found ${wrongDocs.length} documents with 'recipent' field.`);
    wrongDocs.forEach(doc => console.log(`➡️ ID: ${doc._id}, recipent: ${doc.recipent}`));

    // Step 2: Fix them
    if (wrongDocs.length > 0) {
      const result = await FriendRequest.updateMany(
        { recipent: { $exists: true } },
        [
          { $set: { recipient: "$recipent" } },
          { $unset: "recipent" }
        ]
      );
      console.log("✅ Fixed misspelled 'recipent' fields.");
      console.log("Modified Count:", result.modifiedCount);
    } else {
      console.log("ℹ️ No documents need fixing.");
    }
  } catch (error) {
    console.error("❌ Error fixing friend requests:", error);
  } finally {
    mongoose.connection.close();
  }
};

fixFriendRequests();
