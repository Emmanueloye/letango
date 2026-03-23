import { model, Schema, Types } from 'mongoose';

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      required: true,
      default: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default model('Token', tokenSchema);
