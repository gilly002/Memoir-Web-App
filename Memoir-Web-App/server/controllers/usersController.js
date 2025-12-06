import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

import UserModal from "../models/users.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ username });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username: oldUser.username, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, username });

    const token = jwt.sign( { username: result.username, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  if (!req.userId) {
      return res.status(401).json({ message: "Not authorized" });
  }

  const { id } = req.params;
  const { email, username, password, bio } = req.body;
  const profPics = req.file ? `/uploads/profilePic/${req.file.filename}` : '';
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'No such user' });
  }

  try {
      let updatedUser = { email, username, bio, profPics, _id: id };

      const user = await UserModal.findByIdAndUpdate(id, updatedUser, { new: true });
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



export const getUser = async (req, res) => {

  try {
    const user = await UserModal.findById(req.userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }


};

