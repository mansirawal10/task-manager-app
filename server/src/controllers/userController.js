import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error loading users", error: error.message });
  }
};