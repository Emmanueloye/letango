import { NextFunction, Request, Response } from 'express';
import Contribution from '../models/contributionModel';
import GroupSetting from '../models/groupSettingModels';
import ContributionMember from '../models/contributionMemberModel';
import { AppError, StatusCodes } from '../errors';
import {
  capitalized,
  GetRequestAPI,
  paginateDetails,
  shortID,
  slugify,
} from '../utils';
import { startSession } from 'mongoose';
import { Types } from 'mongoose';
import { MAX_CONTRIBUTION_ADMIN_LIMIT } from '../constants/constant';

/*==================== User Contribution ==================== */

// contribution group creation handler.
export const createContributionGroup = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  // Get contributions for the logged in user and settlings
  const contributions = await Contribution.find({ createdBy: req!.user!._id });
  const groupSettings = await GroupSetting.find();

  //   Check if contribution group is still within the limit.

  const limit = groupSettings[0]?.contributionGroupLimit ?? 9999;

  if (contributions.length >= limit) {
    throw new AppError.BadRequest(
      'You have exceed the contribution group limit.',
    );
  }

  // Using session because if error occurs either contribution or member, we don't want to create any of the two at all.
  const session = await startSession();

  //   Create new contribution
  await session.withTransaction(async () => {
    const newContribution = await Contribution.create(
      [
        {
          ref: shortID(8),
          name,
          description,
          joinCode: shortID(12),
          createdBy: req!.user?._id,
          admins: [req?.user?._id], //automatically set the owner as admin.
        },
      ],
      { session },
    );

    await ContributionMember.create(
      [
        {
          memberId: req?.user?._id,
          surname: req?.user?.surname,
          otherNames: req?.user?.otherNames,
          email: req?.user?.email,
          contributionId: newContribution?.[0]?._id, // This is because we use array in the first session.
          contributionRef: newContribution?.[0]?.ref,
          isApproved: true,
          role: 'admin',
        },
      ],
      { session },
    );
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Contribution group created successfully.',
  });
};

// get contribution group user belongs to handler.
export const getUserContributionGroups = async (
  req: Request,
  res: Response,
) => {
  // Get the unique group ids a member belongs to
  const groupIds = await ContributionMember.distinct('contributionId', {
    memberId: req?.user?._id,
    isApproved: true,
  });

  //Get all the contribution groups a user belongs to.
  const features = new GetRequestAPI(
    Contribution.find({ _id: { $in: groupIds }, isActive: true }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const contributions = await features.query;

  const queryReq = new GetRequestAPI(
    Contribution.find({ _id: { $in: groupIds } }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();

  let page;
  if (req.query.page) page = paginateDetails(documentCount, req);

  res
    .status(StatusCodes.OK)
    .json({ success: true, noHits: contributions.length, contributions, page });
};

// Get Single contribution handler
export const getContributionGroup = async (req: Request, res: Response) => {
  const contribution = await Contribution.findOne({ ref: req.params.ref });

  if (!contribution) {
    throw new AppError.NotFound(
      'The resourse you are looking for is not available on our server.',
    );
  }

  if (!contribution.isActive) {
    throw new AppError.UnAuthorized(
      'This group is inactive. Please reach out to the admin.',
    );
  }

  const inviteLink = `${process.env.BASE_URL}/join/${slugify(
    contribution.name,
  )}?ref=${contribution.ref}&code=${contribution.joinCode}`;

  res.status(StatusCodes.OK).json({ success: true, contribution, inviteLink });
};

// Join contribution handler.
export const joinContribution = async (req: Request, res: Response) => {
  const { ref, code } = req.body;

  // Get the contribution with the incoming data
  const contribution = await Contribution.findOne({ ref, joinCode: code });

  const groupSetting = await GroupSetting.find();

  const memberLimit = groupSetting[0]?.contributionMemberLimit ?? 9999999;

  // Check if the contribution group exist.
  if (!contribution) {
    throw new AppError.NotFound(
      'The resource you are requesting is not available on our server.',
    );
  }

  // Get members for the contribution group
  const members = await ContributionMember.find({
    contributionId: contribution._id,
  });

  // Check if the membership limit has not been exceeded.
  if (members.length >= memberLimit) {
    throw new AppError.UnAuthorized(
      'The group has reached its membership limit, please reach out to the group admin.',
    );
  }

  // Get member if already exist.
  const existingMember = await ContributionMember.findOne({
    memberId: req?.user?._id,
    contributionId: contribution?._id,
  });

  // This prevent members from joining multiple times. Although there is index, but this is to further enforce.
  if (existingMember) {
    throw new AppError.BadRequest(
      `You are already a member of ${capitalized(contribution.name)}`,
    );
  }

  await ContributionMember.create({
    memberId: req?.user?._id,
    contributionId: contribution._id,
    contributionRef: contribution.ref,
    surname: req?.user?.surname,
    otherNames: req?.user?.otherNames,
    email: req?.user?.email,
    role: 'pending member',
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Thank you for joining ${contribution.name}, you will be able to view the group once your membership is approved.`,
  });
};

// Update contribution.
export const updateContribution = async (req: Request, res: Response) => {
  const { name, description, logo, logoId, isActive } = req.body;
  const contribution = await Contribution.findOneAndUpdate(
    {
      ref: req.params.ref,
    },
    { name, description, logo, logoId, isActive },
    { new: true, runValidator: true },
  );
  res.status(StatusCodes.OK).json({ success: true, contribution });
};

/**========================== Admin handlers ========================**/

// get all contributions for admin

// get contribution group user belongs to handler.
export const getContributions = async (req: Request, res: Response) => {
  //Get all the contribution groups a user belongs to.
  const features = new GetRequestAPI(Contribution.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const contributions = await features.query;

  const queryReq = new GetRequestAPI(Contribution.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();

  let page;
  if (req.query.page) page = paginateDetails(documentCount, req);

  res
    .status(StatusCodes.OK)
    .json({ success: true, noHits: contributions.length, contributions, page });
};

// Get single contribution for admin
export const getContribution = async (req: Request, res: Response) => {
  const contribution = await Contribution.findOne({ ref: req.params.ref });

  if (!contribution) {
    throw new AppError.NotFound(
      'The resourse you are looking for is not available on our server.',
    );
  }

  res.status(StatusCodes.OK).json({ success: true, contribution });
};

// update contribution admin
export const updateContributionAdmin = async (req: Request, res: Response) => {
  const { admin } = req.body;
  const contribution = await Contribution.findOne({ ref: req.params.ref });

  // Get contribution admin limit from group setting.
  const setting = await GroupSetting.find();

  const adminLimit =
    setting[0]?.contributionAdminLimit || MAX_CONTRIBUTION_ADMIN_LIMIT;

  if (!contribution) {
    throw new AppError.NotFound('Contribution group not found.');
  }

  if (contribution.admins.length >= adminLimit) {
    throw new AppError.UnAuthorized('You have reached the admin limit.');
  }

  contribution.admins = [...contribution.admins, admin as Types.ObjectId];
  await contribution.save();

  res.status(StatusCodes.OK).json({ success: true, contribution });
};
