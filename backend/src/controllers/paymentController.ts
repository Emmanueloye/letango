import axios from 'axios';
import { Request, Response } from 'express';
import { AppError, StatusCodes } from '../errors';
import { checkForErrors } from '../utils';
import { body } from 'express-validator';
import Contribution from '../models/contributionModel';

export const validateCollection = checkForErrors([
  body('name').notEmpty().withMessage('Full Name field is required.'),
  body('email').notEmpty().withMessage('Email field is required.'),
  body('amount')
    .notEmpty()
    .withMessage('contribution amount field is required.'),
  body('description').notEmpty().withMessage('Description field is required.'),
]);

export const contributionCollection = async (req: Request, res: Response) => {
  const callback = `${process.env.CALLBACKURL}/${req.params.groupRef}/contribute/confirm`;

  const contribution = await Contribution.findOne({ ref: req.params.groupRef });

  if (req.body.amount <= 0) {
    throw new AppError.BadRequest(
      'Contribution must not be less or equal to zero.',
    );
  }

  const data = {
    email: req.body.email,
    amount: req.body.amount * 100,
    callback_url: callback,
    metadata: {
      customerId: req.user._id,
      isContribution: true,
      transactionType: 'contribution',
      groupRef: contribution?.ref,
      description: req.body.description,
      paymentFrom: req.body.name,
      contributionName: contribution?.name,
    },
  };

  try {
    const url = `${process.env.PAYSTACK_BASEURL}/transaction/initialize`;

    const result = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, paystack: result.data.data });
  } catch (error) {
    let message;
    if (axios.isAxiosError(error)) {
      message = error?.response?.data?.message;
      console.log(error?.response?.data?.message);
    }

    res.status(StatusCodes.BADREQUEST).json({ success: false, message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // console.log(response);

    res
      .status(StatusCodes.OK)
      .json({ success: response.status, data: response.data });
  } catch (error) {
    res
      .status(StatusCodes.BADREQUEST)
      .json({ success: false, message: 'Sorry, an error happened.' });
  }
};
