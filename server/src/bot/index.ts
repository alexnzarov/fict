import Telegraf, { ContextMessageUpdate } from 'telegraf';
import AppConfig from '../config';

const bot = new Telegraf<ContextMessageUpdate>(AppConfig.BOT_TOKEN);
export default bot;

bot.telegram.getMe().then(u => bot.options.username = u.username);

import './debug';
import './start';
import './help';

import './suggestion';

bot.launch();