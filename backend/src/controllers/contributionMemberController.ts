import { Request, Response } from 'express';
import { Types } from 'mongoose';
import ContributionMember from '../models/contributionMemberModel';
import GroupSetting from '../models/groupSettingModels';
import Contribution from '../models/contributionModel';
import { GetRequestAPI, paginateDetails } from '../utils';
import { AppError, StatusCodes } from '../errors';
import { MAX_CONTRIBUTION_ADMIN_LIMIT } from '../constants/constant';

export const getContributionMembers = async (req: Request, res: Response) => {
  const { ref } = req.params;

  const features = new GetRequestAPI(
    ContributionMember.find({ contributionRef: ref }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const contributionMembers = await features.query;

  const queryReq = new GetRequestAPI(
    ContributionMember.find({ contributionRef: ref }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();

  let page;
  if (req.query.page) page = paginateDetails(documentCount, req);

  res.status(StatusCodes.OK).json({
    success: true,
    noHits: contributionMembers.length,
    contributionMembers,
    page,
  });
};

export const updateContributionMember = async (req: Request, res: Response) => {
  const { ref } = req.params;
  const { id, isApproved, memberId, role } = req.body;

  const contributionMember = await ContributionMember.findOne({ _id: id });
  const groupSetting = await GroupSetting.find();
  const contribution = await Contribution.findOne({ ref });

  const settings = groupSetting?.[0];

  //   Check if contribution member exists.
  if (!contribution) {
    throw new AppError.NotFound('Contribution group not found.');
  }

  if (!contributionMember) {
    throw new AppError.NotFound('Contribution member not found.');
  }

  //   If we are changing role from member to admin.
  if (role === 'admin') {
    // Check if admin limit has not been exceeded.
    if (
      contribution?.admins &&
      contribution.admins.length >=
        (settings?.contributionAdminLimit ?? MAX_CONTRIBUTION_ADMIN_LIMIT)
    ) {
      throw new AppError.BadRequest(
        'Admin limit reached for this contribution group.',
      );
    }

    // Check if the member is already an admin.
    if (contribution?.admins.includes(memberId)) {
      throw new AppError.BadRequest(
        'Member is already an admin to this group.',
      );
    }

    contribution.admins = [...contribution?.admins, memberId];
    contribution.save();
    contributionMember.role = role;
    contributionMember.roleUpdatedBy = req.user._id;
    contributionMember.roleUpdatedAt = new Date(Date.now());
    await contributionMember.save();
  }
  if (role === 'member') {
    let admins: Types.ObjectId[] = [];
    if (contribution?.admins.includes(memberId)) {
      admins = contribution?.admins.filter(
        (adminId) => adminId.toString() !== memberId,
      );
    }

    contributionMember.role = role;
    contributionMember.roleUpdatedBy = req.user._id;
    contributionMember.roleUpdatedAt = new Date(Date.now());
    await contributionMember.save();

    contribution.admins = admins;
    await contribution.save();
  }

  if (isApproved) {
    contributionMember.isApproved = isApproved;
    contributionMember.approvedBy = req.user._id;
    contributionMember.role =
      isApproved === 'true' ? 'member' : 'pending member';
    await contributionMember.save();
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Contribution member updated successfully.',
  });
};
