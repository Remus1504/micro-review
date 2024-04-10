import { addReview } from '../Services/review-service';
import { IReviewDocument } from '@remus1504/micrograde-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const review = async (req: Request, res: Response): Promise<void> => {
  const review: IReviewDocument = await addReview(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ message: 'Review created successfully.', review });
};
