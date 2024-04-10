import { verifyGatewayRequest } from '@remus1504/micrograde-shared';
import { Application } from 'express';
import { healthRoutes } from './Endpoints/health';
import { reviewRoutes } from './Endpoints/review';

const BASE_PATH = '/api/v1/review';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, reviewRoutes());
};

export { appRoutes };
