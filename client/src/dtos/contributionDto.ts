export type Contribution = {
  _id: string;
  ref: string;
  name: string;
  description: string;
  logo: string;
  logoId: string;
  balance: number;
  effectiveBalance: number;
  admins: string[];
  isActive: boolean;
  groupType: string;
  joinCode: number;
  deactivationReason: string;
  approvalAuthorities: string[];
  createdAt: string;
};

export type ContributionTransaction = {
  _id: string;
  groupRef: string;
  groupId: string;
  amount: number;
  description: string;
  transactionType: string;
  contributedBy: {
    _id: string;
    surname: string;
    otherNames: string;
  };
  paidAt: Date;
  paymentRef: string;
  paymentId: number;
  charge: number;
  withdrawalCharge: number;
  accountNumber: number;
  accountName: string;
  withdrawalStatus: string;
  withdrawalId: string;
  withdrawalRejectionReason: string;
  initatedBy: string;
  contribution: string;
  contributorName: string;
};

export type Report = {
  success: boolean;
  noHits: number;
  startingDate: string;
  endingDate: string;
  page: {
    totalPages: number;
    currentPage: number;
    previousPage: number;
    nextPage: number;
  };
  transactions: ContributionTransaction[];
};
