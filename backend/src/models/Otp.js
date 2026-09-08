import mongoose from 'mongoose';

export const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '10m' }, // automatically delete document after expiry
    },
  },
  {
    timestamps: true,
  }
);

export const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;

