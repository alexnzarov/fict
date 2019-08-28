import bot, { stage } from '..';
import sendAuthMessage from './auth';
import AppConfig from '../../config';
import Keyboard from '../utils/Keyboard';

const helloMessage = [
  '<b>Привет, я дружелюбный FICT robot.</b>\n',
  //'Моя цель существования - помощь студентам.\n',
  'Для того, чтобы предложить пост на наш канал, можешь просто написать мне, а я передам твоё пожелание.\n',
  'Так же можешь ознакомиться с нашими ресурсами, которые я указал ниже.\n',
  //`Наш сайт: https://${AppConfig.HOST}`,
  'Официальный чат: https://t.me/fict_talk',
  'Официальный канал: https://t.me/fict_time',
].join('\n');

const handlers = {
  auth: sendAuthMessage,
  join: () => {},
};

bot.start(async (ctx) => {
  const tokens = ctx.message.text.split(' ');
  const action = tokens[1];

  if (action && handlers[action]) {
    return handlers[action](ctx);
  }

  stage.leave();
  ctx.replyWithHTML(helloMessage, await ctx.getKeyboard());
});