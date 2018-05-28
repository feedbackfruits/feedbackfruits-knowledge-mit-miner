"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').load({ silent: true });
const { NAME = 'feedbackfruits-knowledge-mit-miner', KAFKA_ADDRESS = 'tcp://localhost:9092', OUTPUT_TOPIC = 'staging_mit_update_requests', } = process.env;
exports.NAME = NAME;
exports.KAFKA_ADDRESS = KAFKA_ADDRESS;
exports.OUTPUT_TOPIC = OUTPUT_TOPIC;
const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 100;
exports.CONCURRENCY = CONCURRENCY;
