import { Schema, Model } from 'mongoose';

export interface User {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
}

const UserSchema = new Schema<User, Model<User>>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    collection: 'user',
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

export default UserSchema;
