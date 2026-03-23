export type IContributionMembers = {
  _id: string;
  memberId: {
    _id: string;
    surname: string;
    otherNames: string;
    photo: string;
    email: string;
  };
  contributionRef: string;
  contributionId: {
    _id: string;
    name: string;
    ref: string;
    admins: string[];
  };
  isApproved: boolean;
  approvedBy: {
    _id: string;
    surname: string;
    otherNames: string;
  };
  role: string;
  roleUpdatedBy: {
    _id: string;
    surname: string;
    otherNames: string;
  };
  roleUpdatedAt: Date;
  joinedAt: Date;
};
