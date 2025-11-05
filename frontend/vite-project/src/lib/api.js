import { axiosInstance } from "./axios";

// ---------- AUTH ----------
export const signup = async (signUpData) => {
  const response = await axiosInstance.post("/auth/signup", signUpData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    // Log the actual error for better debugging
    console.log("Error in getAuthUser:", error.message); 
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

// ---------- USERS & FRIENDS ----------

export async function getUserFriends() {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
}

export async function getRecommendedUsers() {
  const res = await axiosInstance.get("/users");
  return res.data;
}

export async function getOutgoingFriendReqs() {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
}

export async function sendFriendRequest(userId) {
  // Defensive check for safety, though react-query should ensure this
  if (!userId) {
    throw new Error("Invalid user ID provided for friend request.");
  }

  // 👇 FIX: Sending an empty object {} as the request body is crucial 
  // for many backend frameworks to properly parse the request as JSON.
  // We'll also keep the withCredentials if your setup relies on cookies/sessions.
  const res = await axiosInstance.post(
    `/users/friend-request/${userId}`,
    {}, // Explicitly sending an empty body
    { withCredentials: true }
  );
  return res.data;
}


export async function getFriendRequests() {
   const res = await axiosInstance.get("/users/friend-requests");
   return res.data
}

export async function acceptFriendRequest(requestId) {
  const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return res.data
}
 
export async function getStreamToken(){
  const res = await axiosInstance.get("/chat/token");
  return res.data;
}