import mongoose from "mongoose";
import ProfileModel from "@models/profileModel";
import { RequestHandler } from "express";

interface Profile {
  name: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  contactAddress: string;
  logo?: string;
  website?: string;
  userId: string;
  createdAt: string;
}

// Get all profiles
export const getProfiles: RequestHandler<
  {},
  { data: Profile[] } | { message: string }
> = async (req, res) => {
  try {
    const allProfiles = await ProfileModel.find().sort({ _id: -1 });
    res.status(200).json({ data: allProfiles });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get single profile by ID
export const getProfile: RequestHandler<
  { id: string },
  { data: Profile } | { message: string | Profile }
> = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: "Invalid profile ID" });
    return;
  }

  try {
    const profile = await ProfileModel.findById(id);
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }
    res.status(200).json({ data: profile });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Create new profile
export const createProfile: RequestHandler<
  {},
  { data: Profile } | { message: string; error?: string },
  Profile
> = async (req, res) => {
  const profileData = req.body;

  const newProfile = new ProfileModel(profileData);

  try {
    const existingUser = await ProfileModel.findOne({
      email: profileData.email,
    });
    if (existingUser) {
      res.status(409).json({ message: "Profile already exists" });
      return;
    }

    await newProfile.save();
    res.status(201).json({ data: profileData });
  } catch (error) {
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Get profiles by user ID
export const getProfilesByUser: RequestHandler<
  {},
  { data: Profile } | { message: string },
  {},
  { searchQuery: string }
> = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const profile = await ProfileModel.findOne({ userId: searchQuery });
    res.json({ data: profile });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Search profiles by name or email
export const getProfilesBySearch: RequestHandler<
  {},
  { data: Profile } | { message: string },
  {},
  { searchQuery: string }
> = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const name = new RegExp(searchQuery, "i");
    const email = new RegExp(searchQuery, "i");

    const profiles = await ProfileModel.find({ $or: [{ name }, { email }] });
    res.json({ data: profiles });
  } catch (error) {
    res.status(404).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Update profile
export const updateProfile: RequestHandler<{ id: string }, {}, Partial<Profile>> = async (
  req,
  res
) => {
  const { id: _id } = req.params;
  const profile = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(404).send("No profile with that id");
    return;
  }

  try {
    const updatedProfile = await ProfileModel.findByIdAndUpdate(
      _id,
      { ...profile, _id },
      { new: true }
    );

    if (!updatedProfile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.json(updatedProfile);
  } catch (error) {
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

// Delete profile
export const deleteProfile: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).send(`No profile with id: ${id}`);
    return;
  }

  try {
    const deletedProfile = await ProfileModel.findByIdAndRemove(id);
    if (!deletedProfile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.json({ message: "Profile deleted successfully." });
  } catch (error) {
    res.status(409).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
