import { model, Schema, Types } from 'mongoose';

const contributionTransactionSchema = new Schema(
  {
    groupRef: {
      type: String,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Contribution',
    },
    amount: {
      type: Number,
      //   required: true,
    },
    contribution: String,

    description: {
      type: String,
    },
    transactionType: {
      type: String,
      //   required: true,
    },
    // use this for person contributing and person being paid.
    contributedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    contributorName: String,
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    paymentRef: String,
    paymentId: Number,
    charge: Number,
    withdrawalCharge: Number,
    accountNumber: Number,
    accountName: String,
    withdrawalStatus: {
      type: String,
      enum: ['pending', 'processed', 'reject'],
    },
    withdrawalId: String,
    withdrawalRejectionReason: String,
    approvedOrRejectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    // For withdrawal
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

contributionTransactionSchema.pre(/^find/, function (this: any) {
  this.populate({
    path: 'contributedBy',
    select: 'surname otherNames',
  }).populate({ path: 'initiatedBy', select: 'surname otherNames' });
});

export default model('ContributionTransaction', contributionTransactionSchema);
