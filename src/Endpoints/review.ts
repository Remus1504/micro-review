import { review } from '../Controllers/createReview';
import {
  reviewsByCourseId,
  reviewsByInstructorId,
} from '../Controllers/getReview';
import express, { Router } from 'express';

const router: Router = express.Router();

const reviewRoutes = (): Router => {
  router.get('/course/:courseId', reviewsByCourseId);
  router.get('instructor/:instructorId', reviewsByInstructorId);
  router.post('/', review);

  return router;
};

export { reviewRoutes };
