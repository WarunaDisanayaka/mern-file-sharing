import Metadata from "../models/Metadata.js";

const logMetadata = (action) => {
  return async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { shareId } = req.params;
      const ipAddress = req.ip;
      const deviceInfo = req.headers["user-agent"];

      const metadata = new Metadata({
        userId,
        shareId,
        action,
        ipAddress,
        deviceInfo,
      });

      await metadata.save();
      next();
    } catch (err) {
      console.error("Failed to log metadata:", err);
      next();
    }
  };
};

export default logMetadata;
