const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../services/emailService");
const { User } = require("../models/User");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      gender,
      birthday,
      country,
      city,
      referCode,
    } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a verification token
    const verificationToken = uuidv4();

    // Save the user to the database
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      gender,
      birthday,
      country,
      city,
      referCode,
      verificationToken,
    });
    await user.save();

    // Send verification email to the user
    sendEmail(
      email,
      "Email Verification",
      `Click the following link to verify your email: ${verificationToken}`
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// // User login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "Email not found" });
//     }

//     // Compare the provided password with the stored password
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Invalid password" });
//     }

//     // Check if the user's email is verified
//     if (!user.isEmailVerified) {
//       return res.status(401).json({ error: "Email not verified" });
//     }

//     // TODO: Generate and return a JWT token for authentication

//     res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Error in user login:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Forgot password - Step 1: Send reset password link
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Check if the email is registered
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: "Email not found" });
//     }

//     // Generate a password reset token
//     const resetToken = uuidv4();

//     // Save the reset token to the user in the database
//     user.resetToken = resetToken;
//     await user.save();

//     // Send the reset password email to the user
//     sendEmail(
//       email,
//       "Password Reset",
//       `Click the following link to reset your password: ${resetToken}`
//     );

//     res.status(200).json({ message: "Reset password link sent successfully" });
//   } catch (error) {
//     console.error("Error in sending reset password link:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Forgot password - Step 2: Reset password
// router.post("/reset-password", async (req, res) => {
//   try {
//     const { email, resetToken, newPassword } = req.body;

//     // Find the user by email and reset token
//     const user = await User.findOne({ email, resetToken });
//     if (!user) {
//       return res.status(404).json({ error: "Invalid email or reset token" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update the user's password in the database
//     user.password = hashedPassword;
//     user.resetToken = undefined;
//     await user.save();

//     res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error("Error in resetting password:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Update user profile
// router.put("/profile", upload.single("profilePicture"), async (req, res) => {
//   try {
//     const { userId, fullName, gender, birthday, country, city, bio } = req.body;

//     // Find the user by userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Update the user's profile fields
//     user.fullName = fullName;
//     user.gender = gender;
//     user.birthday = birthday;
//     user.country = country;
//     user.city = city;
//     user.bio = bio;

//     // Check if a profile picture file is uploaded
//     if (req.file) {
//       // Save the path to the profile picture
//       user.profilePicture = req.file.path;
//     }

//     // Save the updated user to the database
//     await user.save();

//     res.status(200).json({ message: "Profile updated successfully" });
//   } catch (error) {
//     console.error("Error in updating profile:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
