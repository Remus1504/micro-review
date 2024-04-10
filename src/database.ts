import { winstonLogger } from '@remus1504/micrograde-shared';
import { Logger } from 'winston';
import { config } from './configuration';
import { Pool } from 'pg';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_ENDPOINT}`,
  'reviewDatabaseServer',
  'debug',
);

const pool: Pool = new Pool({
  host: `${config.DATABASE_HOST}`,
  user: `${config.DATABASE_USER}`,
  password: `${config.DATABASE_PASSWORD}`,
  port: 5432,
  database: `${config.DATABASE_NAME}`,
  ...(config.NODE_ENV !== 'development' &&
    config.CLUSTER_TYPE === 'AWS' && {
      ssl: {
        rejectUnauthorized: false,
      },
    }),
});

pool.on('error', (error: Error) => {
  log.log('error', 'pg client error', error);
  process.exit(-1);
});

const createTableText = `
  CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL UNIQUE,
    courseId text NOT NULL,
    reviewerId text NOT NULL,
    enrolmentId text NOT NULL,
    instructorId text NOT NULL,
    review text NOT NULL,
    reviewerImage text NOT NULL,
    reviewerUsername text NOT NULL,
    country text NOT NULL,
    reviewType text NOT NULL,
    rating integer DEFAULT 0 NOT NULL,
    createdAt timestamp DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
  );

  CREATE INDEX IF NOT EXISTS courseId_idx ON public.reviews (courseId);

  CREATE INDEX IF NOT EXISTS instructorId_idx ON public.reviews (instructorId);
`;

const databaseConnection = async (): Promise<void> => {
  try {
    await pool.connect();
    log.info('Review service successfully connected to postgresql database.');
    await pool.query(createTableText);
  } catch (error) {
    log.error('ReviewService - Unable to connecto to database');
    log.log('error', 'ReviewService () method error:', error);
  }
};

export { databaseConnection, pool };
