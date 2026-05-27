import { model, Schema } from 'mongoose';

const contributionRulesSchema = new Schema({
  contributionId: {
    type: Schema.Types.ObjectId,
    ref: 'Contribution',
    required: true,
  },
  rules: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedAt: Date,
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model('ContributionRules', contributionRulesSchema);
