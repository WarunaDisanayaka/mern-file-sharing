import { verifyToken } from "../utils/token.js";
import { sendMail } from "../../helpers/mail.js";

const authTypes = {
  access: "ACCESS",
};

export const verifyAuthToken = async (req, res, next) => {
  const token = req.cookies?.zgAuth;

  if (!token) {
    await sendMail(
      "warunadesigns@gmail.com", // Replace with the email address you want to notify
      "Unauthorized Access Attempt", // Subject of the email
      "An unauthorized access attempt was made without providing a access." // Email body content
    );
    console.log("mail sent");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decodedToken = verifyToken({ token, type: authTypes.access });
    req.user = decodedToken;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ success: false, message: "Invalid token" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
};
