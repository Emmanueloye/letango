import { Request, Response } from 'express';
import GroupSetting from '../models/groupSettingModels';
import { AppError, StatusCodes } from '../errors';

// Handler for creating group setting. Route will not be made available.
export const createGroupSettings = async (req: Request, res: Response) => {
  const existingSettings = await GroupSetting.find();

  if (existingSettings[0]) {
    await GroupSetting.findByIdAndDelete(existingSettings[0]?._id);
    const settings = await GroupSetting.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, groupSettings: settings });
    return;
  }

  const settings = await GroupSetting.create(req.body);

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, groupSettings: settings });
};

// Handler for getting the settings.
export const getGroupSettings = async (req: Request, res: Response) => {
  const settings = await GroupSetting.find();

  res
    .status(StatusCodes.OK)
    .json({ success: true, groupSettings: settings[0] });
};

// Handler for updating group settings
export const updateGroupSettings = async (req: Request, res: Response) => {
  const settings = await GroupSetting.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

  if (!settings) {
    throw new AppError.NotFound('No resource found for the update.');
  }

  res.status(StatusCodes.OK).json({ success: true, groupSettings: settings });
};
