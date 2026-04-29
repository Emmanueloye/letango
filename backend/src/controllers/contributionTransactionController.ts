import { Request, Response } from 'express';
import Contribution from '../models/contributionModel';
import ContributionTransaction from '../models/contributionTransModel';
import Revenue from '../models/revenueModel';
import User from '../models/userModel';
import GroupSetting from '../models/groupSettingModels';
import { AppError, StatusCodes } from '../errors';
import {
  checkForErrors,
  GetRequestAPI,
  paginateDetails,
  shortID,
} from '../utils';
import { startSession } from 'mongoose';
import { body } from 'express-validator';
import { formatReportDates } from '../utils/reportDateFormat';

export const validateContributionWithdrawal = checkForErrors([
  body('memberId').notEmpty().withMessage('Withdraw to field is required.'),
  body('accountNumber')
    .notEmpty()
    .withMessage('Account number field is required.')
    .isLength({ min: 10, max: 10 })
    .withMessage('Account number must be exactly 10 digits')
    .isNumeric()
    .withMessage('Account number must contain only numbers'),
  body('accountName').notEmpty().withMessage('Account name field is required.'),
  body('description').notEmpty().withMessage('Description field is required.'),
  body('amount').notEmpty().withMessage('Amount field is required.'),
]);

export const contributionWithdrawal = async (req: Request, res: Response) => {
  // get the input data
  const {
    memberId: withdrawTo,
    accountNumber,
    accountName,
    amount,
    groupId,
    description,
  } = req.body;
  //   get the requested contribution
  const contribution = await Contribution.findById(groupId);

  const user = await User.findById(withdrawTo);

  if (!contribution) {
    throw new AppError.NotFound('No resource found for your request.');
  }

  // Get group settings and pick out fixed and variable charge on contribution & minimum withdrawal
  const groupSetting = await GroupSetting.find();
  const fixedCharge = groupSetting[0]?.contributionFixedCharge ?? 0;
  const variableCharge = groupSetting[0]?.contributionVariableCharge ?? 0;
  const minimumWithdrawal = groupSetting[0]?.MinimumContributionWithdrawal ?? 0;

  // Format minimum withdrawal number
  const minWithdraw = new Intl.NumberFormat().format(minimumWithdrawal + 1);

  // Check compliance with minimum withdrawal
  if (amount <= minimumWithdrawal) {
    throw new AppError.BadRequest(`Minimum withdrawal must be ₦${minWithdraw}`);
  }

  // Get all unprocessed withdrawals to calculate effective balance
  const unprocessedWithdrawals = await ContributionTransaction.find({
    groupId,
    amount: { $lt: 0 },

    withdrawalStatus: 'pending',
  });

  // Sum up the unprocessed withdrawals
  const sumOfUnprocessedWithdrawals = unprocessedWithdrawals.reduce(
    (acc, withdrawal) => {
      return acc + (withdrawal.amount ?? 0);
    },
    0,
  );

  // Calculate contribution effective balance
  const effectiveBalance = contribution.balance + sumOfUnprocessedWithdrawals;

  // Check if the effective balance can accommodate the incoming withdrawal.
  if (effectiveBalance < amount) {
    throw new AppError.BadRequest(
      'Insufficient fund to accomodate this withdrawal.',
    );
  }

  // Calculate charges on withdrawal
  const variableChargeCalc = +amount * (variableCharge / 100);
  const totalCharge = fixedCharge + variableChargeCalc;

  // Start a transaction

  const session = await startSession();

  await session.withTransaction(async () => {
    // post the full withdrawal to the group transaction
    await ContributionTransaction.create(
      [
        {
          groupRef: contribution.ref,
          groupId: contribution._id,
          amount: +amount * -1,
          description,
          transactionType: 'contribution withdrawal',
          contributedBy: withdrawTo,
          withdrawalCharge: totalCharge,
          accountNumber,
          accountName,
          withdrawalId: shortID(6),
          initiatedBy: req?.user?._id,
          withdrawalStatus: 'pending',
          contribution: contribution.name,
          contributorName: `${user?.surname} ${user?.otherNames}`,
        },
      ],
      { session },
    );

    // Update contribution
    const withdrawal = Number(amount) * -1;

    contribution.effectiveBalance = contribution?.effectiveBalance
      ? contribution.effectiveBalance + withdrawal
      : contribution.balance + withdrawal;
    await contribution.save({ session });
  });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: 'Withdrawal has been placed.' });
};

// Get all transactions for admin use only
export const getAllContributionTransactions = async (
  req: Request,
  res: Response,
) => {
  const features = new GetRequestAPI(ContributionTransaction.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const transactions = await features.query;

  const queryReq = new GetRequestAPI(ContributionTransaction.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();
  let page;
  if (req.query.page) page = paginateDetails(documentCount, req);

  res
    .status(StatusCodes.OK)
    .json({ success: true, noHits: transactions.length, transactions, page });
};

// get my transaction
export const getMyContributionTransactions = async (
  req: Request,
  res: Response,
) => {
  const { startDate, endDate, groupRef } = req.query;

  if (!startDate || !endDate) {
    throw new AppError.BadRequest(
      'Please ensure you fill in report start and end date.',
    );
  }

  const [startingDate, endingDate] = formatReportDates(
    startDate as string,
    endDate as string,
  );

  if (!startingDate || !endingDate) {
    throw new AppError.BadRequest('Invalid date format provided.');
  }

  if (startingDate > endingDate) {
    throw new AppError.BadRequest('Start date must be before end date.');
  }

  const query = {
    contributedBy: req.user._id,
    groupRef,
    paidAt: { $gte: startingDate, $lte: endingDate },
  };

  const transactions = await ContributionTransaction.find(query);

  res.status(StatusCodes.OK).json({
    success: true,
    noHits: transactions.length,
    startingDate,
    endingDate,
    transactions,
  });
};

export const getWithdrawal = async (req: Request, res: Response) => {
  const withdrawal = await ContributionTransaction.findOne({
    withdrawalId: req.params.withdrawalId,
  });

  if (!withdrawal) {
    throw new AppError.NotFound(
      'The resource you are looking for is not availabe on our server.',
    );
  }

  res.status(StatusCodes.OK).json({ success: true, withdrawal });
};

export const processWithdrawal = async (req: Request, res: Response) => {
  const { withdrawalId, rejectionReason, withdrawalStatus } = req.body;
  console.log(withdrawalId);

  if (!withdrawalId) {
    throw new AppError.BadRequest(
      'No resource found for the withdrawal you request.',
    );
  }

  const withdrawal = await ContributionTransaction.findOne({
    withdrawalId,
  });

  if (!withdrawal) {
    throw new AppError.NotFound(
      'No resource found for the withdrawal you request.',
    );
  }

  const contribution = await Contribution.findById(withdrawal?.groupId);

  if (!contribution) {
    throw new AppError.NotFound('No group found for this withdrawal.');
  }

  const existingRevenue = await Revenue.findOne({
    transactionId: withdrawalId,
  });

  if (existingRevenue) {
    throw new AppError.BadRequest('Withdrawal already processed.');
  }
  const session = await startSession();

  await session.withTransaction(async () => {
    if (withdrawalStatus === 'processed') {
      withdrawal.withdrawalStatus = withdrawalStatus;
      withdrawal.approvedOrRejectedBy = req.user._id;
      withdrawal.updatedAt = new Date(Date.now());
      await withdrawal.save({ session });

      contribution.balance += withdrawal?.amount ?? 0;
      await contribution.save({ session });

      withdrawal.amount =
        (withdrawal.amount ?? 0) + (withdrawal.withdrawalCharge ?? 0);
      await withdrawal.save({ session });

      await Revenue.create(
        [
          {
            groupId: contribution._id,
            revenueType: 'contribution',
            amount: withdrawal?.withdrawalCharge ?? 0,
            transactionId: withdrawalId,
          },
        ],
        { session },
      );

      await ContributionTransaction.create(
        [
          {
            groupRef: withdrawal?.groupRef,
            groupId: withdrawal?.groupId,
            amount: (withdrawal?.withdrawalCharge ?? 0) * -1,
            contribution: withdrawal?.contribution,
            description: `withdrawal charge on payout to ${withdrawal?.contributorName}`,
            contributedBy: withdrawal?.contributedBy,
            paidAt: Date.now(),
            transactionType: 'Charge',
          },
        ],
        { session },
      );

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Withdrawal has been processed.',
      });
      return;
    }

    if (withdrawalStatus === 'reject') {
      if (!rejectionReason) {
        throw new AppError.BadRequest(
          'Please provide a reason for rejecting this withdrawal.',
        );
      }

      withdrawal.withdrawalStatus = withdrawalStatus;
      withdrawal.withdrawalRejectionReason = rejectionReason;
      withdrawal.approvedOrRejectedBy = req.user._id;
      withdrawal.updatedAt = new Date(Date.now());
      await withdrawal.save({ session });

      // Create a reversal.

      await ContributionTransaction.create(
        [
          {
            groupRef: withdrawal?.groupRef,
            groupId: withdrawal?.groupId,
            amount: (withdrawal?.amount ?? 0) * -1,
            contribution: withdrawal?.contribution,
            description: `Reversal of ${withdrawal?.description} due to rejection.`,
            contributedBy: withdrawal?.contributedBy,
            paidAt: Date.now(),
            transactionType: 'withdrawal reversal',
            withdrawalStatus: 'reversal',
          },
        ],
        { session },
      );

      console.log(withdrawal?.amount);

      // Want to update the effective balance to make the fund available for future transaction.
      contribution.effectiveBalance += (withdrawal?.amount ?? 0) * -1;
      await contribution.save({ session });

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Withdrawal has been rejected.',
      });
      return;
    }
  });
};
