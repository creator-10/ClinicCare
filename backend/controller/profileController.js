import Profile from "../models/profileModel.js";

export const updateProfile = async (req, res) => {
  try {
    const { patientId, name, email, phone, address, gender, dob, image } = req.body;

    if (!patientId) {
      return res.status(400).json({ success: false, error: "Missing patientId" });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { patientId },
      { name, email, phone, address, gender, dob, image },
      { new: true, upsert: true }
    );

    if (!updatedProfile) {
      return res.status(500).json({ success: false, error: "Failed to update profile" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
      image: updatedProfile.image,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, error: "Server error while updating profile" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const profile = await Profile.findOne({ patientId });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error while fetching profile" });
  }
};
