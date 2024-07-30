import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shareId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String, required: true },
  deviceInfo: { type: String }, // Optional
});

const Metadata = mongoose.model("Metadata", metadataSchema);

export default Metadata;
