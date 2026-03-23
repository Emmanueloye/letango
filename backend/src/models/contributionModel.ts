import { InferSchemaType, model, Schema, Types } from 'mongoose';

const contributionSchema = new Schema(
  {
    ref: {
      type: String,
      required: [true, 'Contribution ref field is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Contribution name field is required.'],
      min: [4, 'Contribution name must be at least four (4) character long'],
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Contribution description field is required'],
    },
    logo: String,
    logoId: String,
    balance: {
      type: Number,
      default: 0,
    },
    effectiveBalance: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
    },
    admins: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    groupType: {
      type: String,
      default: 'Contribution',
    },
    joinCode: String,
    deactivationReason: String,
    approvalAuthorities: {
      type: [Types.ObjectId],
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

export type IContribution = InferSchemaType<typeof contributionSchema> & {
  _id: Types.ObjectId;
};

export default model('Contribution', contributionSchema);
