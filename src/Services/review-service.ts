import { pool } from '../database';
import { publishFanoutMessage } from '../Queues/review-producer';
import { reviewChannel } from '../../src/server';
import {
  IReviewDocument,
  IReviewMessageDetails,
} from '@remus1504/micrograde-shared';
import { map } from 'lodash';
import { QueryResult } from 'pg';

interface IReviewerObjectKeys {
  [key: string]: string | number | Date | undefined;
}

const objKeys: IReviewerObjectKeys = {
  review: 'review',
  rating: 'rating',
  country: 'country',
  courseid: 'courseId',
  reviewerid: 'reviewerId',
  createdat: 'createdAt',
  enrolmentid: 'enrolmentId',
  instructorid: 'instructorId',
  reviewerimage: 'reviewerImage',
  reviewerusername: 'reviewerUsername',
  reviewtype: 'reviewType',
};

const addReview = async (data: IReviewDocument): Promise<IReviewDocument> => {
  const {
    courseId,
    reviewerId,
    reviewerImage,
    instructorId,
    review,
    rating,
    enrolmentId,
    reviewType,
    reviewerUsername,
    country,
  } = data;
  const createdAtDate = new Date();
  const { rows } = await pool.query(
    `INSERT INTO reviews(courseId, reviewerId, reviewerImage, instructorId, review, rating, enrolmentId, reviewType, reviewerUsername, country, createdAt)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
    [
      courseId,
      reviewerId,
      reviewerImage,
      instructorId,
      review,
      rating,
      enrolmentId,
      reviewType,
      reviewerUsername,
      country,
      createdAtDate,
    ],
  );
  const messageDetails: IReviewMessageDetails = {
    courseId: data.courseId,
    reviewerId: data.reviewerId,
    instructorId: data.instructorId,
    review: data.review,
    rating: data.rating,
    enrolmentId: data.enrolmentId,
    createdAt: `${createdAtDate}`,
    type: `${reviewType}`,
  };
  await publishFanoutMessage(
    reviewChannel,
    'micrograde-review',
    JSON.stringify(messageDetails),
    'Review details sent to order and users services',
  );
  const result: IReviewDocument = Object.fromEntries(
    Object.entries(rows[0]).map(([key, value]) => [objKeys[key] || key, value]),
  );
  return result;
};

const getReviewsByCourseId = async (
  courseId: string,
): Promise<IReviewDocument[]> => {
  const reviews: QueryResult = await pool.query(
    'SELECT * FROM reviews WHERE reviews.courseId = $1',
    [courseId],
  );
  const mappedResult: IReviewDocument[] = map(reviews.rows, (key) => {
    return Object.fromEntries(
      Object.entries(key).map(([key, value]) => [objKeys[key] || key, value]),
    );
  });
  return mappedResult;
};

const getReviewsByInstructorId = async (
  instructorId: string,
): Promise<IReviewDocument[]> => {
  const reviews: QueryResult = await pool.query(
    'SELECT * FROM reviews WHERE reviews.instructorId = $1 AND reviews.reviewType = $2',
    [instructorId, 'instructor-review'],
  );
  const mappedResult: IReviewDocument[] = map(reviews.rows, (key) => {
    return Object.fromEntries(
      Object.entries(key).map(([key, value]) => [objKeys[key] || key, value]),
    );
  });
  return mappedResult;
};

export { addReview, getReviewsByCourseId, getReviewsByInstructorId };
