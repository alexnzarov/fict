import bot from './';
import sendAuthMessage from './auth';
import AppConfig from '../config';

const helloMessage = [
  '<b>Привет, я дружелюбный FICT Robot.</b>\n',
  'Моя цель существования - помощь студентам.\n',
  'Для того, чтобы предложить пост на наш канал, можешь просто написать мне, я передам твоё пожелание!\n',
  'Так же можешь ознакомиться с нашими ресурсами, которые я указал ниже.\n',
  //`Наш сайт: https://${AppConfig.HOST}`,
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