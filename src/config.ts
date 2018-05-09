require('dotenv').load({ silent: true });

const {
  NAME = 'mit',
  KAFKA_ADDRESS = 'tcp://localhost:9092',
  OUTPUT_TOPIC = 'update_requests',

} = process.env;

const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 100;

export {
  NAME,
  KAFKA_ADDRESS,
  OUTPUT_TOPIC,
  CONCURRENCY
};
