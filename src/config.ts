require('dotenv').config();

const {
  NAME = 'feedbackfruits-knowledge-mit-miner',
  KAFKA_ADDRESS = 'tcp://localhost:9092',
  OUTPUT_TOPIC = 'staging_mit_update_requests',

  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET = 'open-learning-course-data-rc',
} = process.env;

const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 1;

export {
  NAME,
  KAFKA_ADDRESS,
  OUTPUT_TOPIC,

  CONCURRENCY,

  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET,
};
