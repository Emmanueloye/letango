import { model, Schema } from 'mongoose';

const revenueSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Contribution',
  },
  revenueType: String,
  amount: Number,
  transactionId: {
    type: String,
  },
  withdrawalId: {
    type: Schema.Types.ObjectId,
    ref: 'ContributionTransaction',
  },
});

export default model('Revenue', revenueSchema);
