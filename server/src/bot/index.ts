import Telegraf, { ContextMessageUpdate } from 'telegraf';
import AppConfig from '../config';

const bot = new Telegraf<ContextMessageUpdate>(AppConfig.BOT_TOKEN);
export default bot;

import './start';
import './help';

bot.launch();