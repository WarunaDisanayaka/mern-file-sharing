import bcrypt from "bcrypt";
import zip from "express-zip";
import Share from "../../models/Share.js";
import File from "../../models/File.js";
import jwt from "jsonwebtoken"; // Make sure to use default import
import { verifyToken } from "../../utils/token.js";
import { sendMail } from "../../../helpers/mail.js";

const create_share = async (req, res) => {
  const { name, password, accessibleUsers } = req.body;
  const { userId } = req.user;

  try {
    let hashPassword;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    const newShare = new Share({
      name,
      password: hashPassword,
      userId,
      accessibleUsers, // Passing accessible users here
    });

    await newShare.save();

    return res.status(200).json({
      success: true,
      message: "Your file share was created successfully",
      data: {
        shareId: newShare._id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const get_share_by_id = async (req, res) => {
  const { userId } = req.user;
  const { shareId } = req.params;

  try {
    const existingShare = await Share.findOne({ _id: shareId, userId });
    const files = await File.find({ shareId, userId });
    return res.status(200).json({
      success: true,
      data: {
        share: existingShare,
        files,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const get_publish_share_by_id = async (req, res) => {
  const { shareId } = req.params;

  try {
    const existingShare = await Share.findOne({ _id: shareId });
    return res.status(200).json({
      success: true,
      data: {
        share: existingShare,
        isPassword: !!existingShare.password,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const get_all_share_by_userId = async (req, res) => {
  const { userId } = req.user;

  try {
    const allShares = await Share.find({ userId });
    return res.status(200).json({
      success: true,
      data: allShares,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const delete_share = async (req, res) => {
  const { userId } = req.user;
  const { shareId } = req.params;

  try {
    await Share.findOneAndDelete({ _id: shareId, userId });
    return res.status(200).json({
      success: true,
      message: "Share deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const download_link = async (req, res) => {
  const { shareId } = req.params;

  try {
    // You can also check the email passed in the request
    const { email: requestEmail } = req.body;

    // Fetch the share document from the database
    const share = await Share.findById(shareId); // Adjust this line according to your model

    // Check if the share document was found
    if (!share) {
      return res
        .status(404)
        .json({ success: false, message: "Share not found." });
    }

    // Check if the requesting email is in the accessibleUsers array
    if (!share.accessibleUsers.includes(requestEmail)) {
      // Send notification email for unauthorized access attempt
      await sendMail(
        "warunadesigns@gmail.com", // Replace with the email address you want to notify
        "Unauthorized Access Attempt", // Subject of the email
        "An unauthorized access attempt was made without providing access." // Email body content
      );
      console.log("Mail sent for unauthorized access attempt");

      return res
        .status(403)
        .json({ success: false, message: "Access denied For this file" });
    }

    // If the email matches, send back the download link
    return res.status(200).json({
      success: true,
      data: {
        download_link: `http://localhost:8000/api/v1/share/files/download/${shareId}`,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const download_files = async (req, res) => {
  const { shareId } = req.params;

  try {
    const files = await File.find({ shareId });

    const downloadableFiles = files.map((file) => {
      return { path: file.path, name: file.originalname };
    });
    return res.zip(downloadableFiles);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export {
  create_share,
  get_share_by_id,
  get_all_share_by_userId,
  delete_share,
  get_publish_share_by_id,
  download_files,
  download_link,
};
