import { NextFunction, Request, Response } from 'express';
import Contribution from '../models/contributionModel';
import ContributionMember from '../models/contributionMemberModel';
import { AppError } from '../errors';

// Check if a user is a member before accessing a group.
export const checkMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Set up various ways of getting group id to check for contribution members.
  let groupRef;

  if (req.params.ref) {
    groupRef = req.params.ref;
  } else if (req.body.contributionRef) {
    groupRef = req.body.contributionRef;
  } else if (req.query.groupRef) {
    groupRef = req.query.groupRef;
  }

  const members = await ContributionMember.findOne({
    memberId: req?.user?._id,
    contributionRef: groupRef,
    isApproved: true,
  });

  if (!members) {
    throw new AppError.UnAuthorized(
      'You are not permitted to access this resource.',
    );
  }

  next();
};

// Middleware to check if a member is a group admin
export const checkContributionAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Set up various ways of getting group id to check for contribution admin.
  let groupRef;

  if (req.params.ref) {
    groupRef = req.params.ref;
  } else if (req.body.contributionRef) {
    groupRef = req.body.contributionRef;
  } else if (req.query.groupRef) {
    groupRef = req.query.groupRef;
  }

  const contribution = await Contribution.findOne({ ref: groupRef });

  if (!contribution) {
    throw new AppError.NotFound('The resource is not available on our server.');
  }

  const admins = contribution.admins.map((id) => id.toString());

  if (!admins.includes(req?.user?._id.toString())) {
    throw new AppError.UnAuthorized(
      'You are not permitted to perform this action.',
    );
  }
  next();
};

// Middleware to switch ref and code to join group to the request body.
export const joinContributionParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body.ref) req.body.ref = req.query.ref;
  if (!req.body.code) req.body.ref = req.query.code;
  next();
};
