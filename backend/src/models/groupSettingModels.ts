import { InferSchemaType, model, Schema } from 'mongoose';

const groupSettingSchema = new Schema({
  contributionGroupLimit: {
    type: Number,
  },
  contributionMemberLimit: {
    type: Number,
  },
  contributionAdminLimit: Number,
  contributionFixedCharge: Number,
  contributionVariableCharge: Number,
  MinimumContributionWithdrawal: Number,
  basicMembershipFee: {
    type: Number,
  },
  basicMemberLimit: {
    type: Number,
  },
  standardMembershipFee: {
    type: Number,
  },
  standardMemberLimit: {
    type: Number,
  },
  premiumMembershipFee: {
    type: Number,
  },
  premiumMemberLimit: {
    type: Number,
  },
});

export type IGroupSetting = InferSchemaType<typeof groupSettingSchema>;

export default model('GroupSetting', groupSettingSchema);
