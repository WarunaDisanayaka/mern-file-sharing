import pkg from "joi";
const { string, object } = pkg;
import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    signature: {
      type: String,
      allowNull: true,
    },
    biometricSignature: {
      type: String,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
