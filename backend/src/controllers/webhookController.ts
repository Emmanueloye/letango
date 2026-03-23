import { Request, Response } from 'express';
import Contribution from '../models/contributionModel';
import ContributionTransaction from '../models/contributionTransModel';
import User from '../models/userModel';
import { startSession } from 'mongoose';
import crypto from 'crypto';
import { AppError, StatusCodes } from '../errors';

export const webhook = async (req: Request, res: Response) => {
  //validate event
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET as string)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;

    const session = await startSession();
    /*======================= Handle payment collection for contribution =======================*/
    if (event.data.metadata.isContribution) {
      try {
        await session.withTransaction(async () => {
          //Get the contribution
          const contribution = await Contribution.findOne({
            ref: event.data.metadata.groupRef,
          }).session(session);

          const user = await User.findById(event.data.metadata.customerId);

          if (!contribution) {
            throw new AppError.NotFound('Contribution group is not found.');
          }

          // Create contribution transaction
          await ContributionTransaction.create(
            [
              {
                groupRef: contribution?.ref,
                groupId: contribution?._id,
                amount: event.data.amount / 100,
                transactionType: event.data.metadata.transactionType,
                contributedBy: event.data.metadata.customerId,
                description: event.data.metadata.description,
                paymentRef: event.data.reference,
                paymentId: event.data.id,
                charge: event.data.fees / 100,
                contribution: contribution.name,
                contributorName: `${user?.surname} ${user?.otherNames}`,
              },
            ],
            { session },
          );

          // Update the contribution balance.
          contribution!.balance += event.data.amount / 100;
          contribution!.effectiveBalance += event.data.amount / 100;
          await contribution?.save({ session });
        });
        res.status(StatusCodes.OK).json({ success: true });
      } catch (error) {
        console.log(error);

        await session.abortTransaction();
        res.status(StatusCodes.BADREQUEST).json({ success: false });
      }
    }

    /*======================= Handle payment collection for contribution =======================*/
    // if(event.data.metadata.isClubContribution){}
  }
};
