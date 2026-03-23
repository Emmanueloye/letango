import { model, Schema, Types } from 'mongoose';

const contributionMemberSchema = new Schema(
  {
    memberId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    surname: String,
    otherNames: String,
    email: String,
    contributionRef: {
      type: String,
      required: true,
    },
    contributionId: {
      type: Types.ObjectId,
      ref: 'Contribution',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedDate: Date,
    role: {
      type: String,
      enum: {
        values: ['member', 'owner', 'admin', 'pending member'],
        message: '{VALUE} is Invalid value.',
      },
      required: true,
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now(),
    },
    roleUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    roleUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// contributionMemberSchema.index({ user: 1, group: 1 }, { unique: true });

contributionMemberSchema.pre(/^find/, function (this: any) {
  this.populate({
    path: 'memberId',
    select: 'surname otherNames email photo',
  })
    .populate({ path: 'contributionId', select: 'name ref admins' })
    .populate({ path: 'roleUpdatedBy', select: 'surname otherNames' })
    .populate({ path: 'approvedBy', select: 'surname otherNames' });
});

export default model('ContributionMember', contributionMemberSchema);
