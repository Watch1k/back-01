import { runDB } from '../../src/db/mongo.db';

export const startDb = () => runDB(process.env.MONGO_URL || '');
