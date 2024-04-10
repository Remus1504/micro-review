import {
  getReviewsByCourseId,
  getReviewsByInstructorId,
} from '../Services/review-service';
import { IReviewDocument } from '@remus1504/micrograde-shared';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const reviewsByCourseId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reviews: IReviewDocument[] = await getReviewsByCourseId(
    req.params.courseId,
  );
  res
    .status(StatusCodes.OK)
    .json({ message: 'Course reviews by course id', reviews });
};

export const reviewsByInstructorId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const reviews: IReviewDocument[] = await getReviewsByInstructorId(
    req.params.instructorId,
  );
  res
    .status(StatusCodes.OK)
    .json({ message: 'course reviews by instructor id', reviews });
};
