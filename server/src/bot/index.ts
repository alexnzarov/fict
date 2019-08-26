import Telegraf from 'telegraf';
import MessageUpdate from './core/MessageUpdate';
import AppConfig from '../config';
import MongoSession from '../middlewares/botSessions';
import Database from '../core/db';
import logger from '../core/Logger';

const bot = new Telegraf<MessageUpdate>(AppConfig.BOT_TOKEN);
export default bot;

bot.use(MongoSession);

bot.telegram.getMe().then(u => bot.options.username = u.username);

import './core/context';

import './actions/debug';
import './actions/start';
import './actions/help';
import './actions/lost';

import './actions/suggestion';

/*
  Bot should not pull updates until we connect to the database.
  Otherwise session saving will not work properly.
*/
Database.get().then(() => {
  logger.info('Starting pulling updates for the Telegram bot');
  bot.launch();
});