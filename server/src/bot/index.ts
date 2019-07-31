import Telegraf, { ContextMessageUpdate } from 'telegraf';
import AppConfig from '../config';

import sendAuthMessage from './auth';

const bot = new Telegraf<ContextMessageUpdate>(AppConfig.BOT_TOKEN);

const helloMessage = [
	'<b>Привет, я дружелюбный FICT Robot.</b>\n',
	'Моя цель существования - помощь студентам.',
	'Чтобы узнать больше о том, что я умею, напиши /help.\n',
	'Так же можешь ознакомиться с нашими ресурсами, которые я указал ниже.\n',
	`Наш сайт: https://${AppConfig.HOST}/`,
	'Официальный чат: https://t.me/fict_talk',
	'Официальный канал: https://t.me/fict_time',
].join('\n');

bot.start((ctx) => {
	const tokens = ctx.message.text.split(' ');
	if (tokens[1] === 'auth') {
		return sendAuthMessage(ctx);
	}

	ctx.replyWithHTML(helloMessage);
});

bot.command('/help', (ctx) => {
	ctx.reply('Я пока ничего не умею, а ты?');
});

bot.launch();