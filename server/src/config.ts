import IConfig from './core/IConfig';
import * as dotenv from 'dotenv';

dotenv.config();

export default { 
	BOT_TOKEN: process.env.BOT_TOKEN,
	BOT_FORWARD_GROUPS: process.env.BOT_FORWARD_GROUPS.split(';').map(v => parseInt(v)),
	BOT_LOG_GROUP: parseInt(process.env.BOT_LOG_GROUP || '-1'),

	MONGODB_URI: process.env.MONGODB_URI,

	HOST: process.env.HOST,
	PORT: parseInt(process.env.PORT || '8000'),
} as IConfig;