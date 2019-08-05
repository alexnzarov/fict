import Telegraf from 'telegraf';
import MessageUpdate from './MessageUpdate';
import AppConfig from '../config';
import MongoSession from '../middlewares/botSessions';
import Database from '../core/db';
import logger from '../core/Logger';

const bot = new Telegraf<MessageUpdate>(AppConfig.BOT_TOKEN);
export default bot;

bot.use(MongoSession);

bot.telegram.getMe().then(u => bot.options.username = u.username);

import './actions/debug';
import './actions/start';
import './actions/help';

import './actions/suggestion';

/*
  Bot should not pull updates until we connected to the database.
  Otherwise session saving will not work properly.
*/
Database.get().then(() => {
  logger.info('Starting pulling updates for the Telegram bot');
  bot.launch();
});