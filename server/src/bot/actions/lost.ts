import AppConfig from '../../config';
import InlineKeyboard from '../utils/InlineKeyboard';
import bot from '..';
import LostEntry from '../core/LostEntry';
import { ExtraEditMessage, User, Location } from 'telegraf/typings/telegram-types';

bot.command('/lost', (ctx) => ctx.replyWithHTML('Ты потерялся? Ничего, не бойся.\n\n<b>Отправь мне свою локацию через вложения или нажми на кнопку "Я потерялся", чтобы я смог тебе помочь!</b>'))

const instructions = [
  '<b>Твоя локация была передана в надёжные руки!</b>\n',
  'Оставайся там, где ты оставил(а) метку.',
  'Скоро с тобой свяжутся и помогут с твоей проблемой.\n',
  '<i>Если твоя проблема решилась, пожалуйста, нажми на кнопку "Со мной всё хорошо", чтобы мы не волновались.</i>',
].join('\n');

const helpKb = InlineKeyboard([{ text: 'Со мной всё хорошо', callback_data: 'l_close_entry' }]);
const modKb = InlineKeyboard([{ text: 'Я помогу', callback_data: 'l_will_help' }]) as ExtraEditMessage;
modKb.parse_mode = 'HTML';

const getMessageContent = (user: User, location: Location | string) => {
  const url = typeof(location) === 'string' ? location : `https://google.com/maps/?q=${location.latitude},${location.longitude}`;
  const entry = LostEntry.get(user.id);
  const onCase = entry ? entry.peopleOnCase : [];

  const modMessage = [
    `${bot.context.getUserTag(user)} <b>нуждается в вашей помощи.</b>\n`,
    onCase.length === 0 ? '<i>Пока никто не вызвался на помощь.</i>\n' : `<b>Вызвались на помощь: </b>` + onCase.map(p => p.name).join(', ') + '\n',
    `<a href="${url}">Открыть отправленную локацию в Google Maps</a>`
  ].join('\n');

  return modMessage;
};

bot.on('location', async (ctx) => {
  const content = getMessageContent(ctx.from, ctx.message.location);
  const msg = await bot.telegram.sendMessage(AppConfig.BOT_SUGGESTION_GROUP, content, modKb);
  
  const { latitude, longitude } = ctx.message.location;
  LostEntry.create({ id: ctx.from.id, latitude, longitude, messageId: ctx.message.message_id, modMessageId: msg.message_id });
  
  ctx.replyWithHTML(instructions, helpKb);
});

bot.on('callback_query', async (ctx) => {
  const query = ctx.callbackQuery;

  if (query.data === 'l_close_entry') {
    const entry = LostEntry.get(query.from.id);
    if (!entry) { return ctx.answerCbQuery('Это событие уже устарело'); }

    const onCase = entry.peopleOnCase;
    const resolvedMsg = [
      '<b>Проблема решена</b>\n',
      `${ctx.getUserTag(query.from)} сообщил мне, что у него всё уладилось.\n`,
      (onCase.length === 0 ? '' : `<b>Ему помогали: </b>` + onCase.map(p => p.name).join(', '))
    ].join('\n');
    await bot.telegram.editMessageText(AppConfig.BOT_SUGGESTION_GROUP, entry.modMessageId, null, resolvedMsg, { parse_mode: 'HTML' });
    await bot.telegram.editMessageText(query.from.id, query.message.message_id, null, 'Я очень рад, что мы смогли помочь с твоей проблемой!\nНе бойся обращаться ещё, если что-нибудь случится.');

    entry.delete();
  }
  else if (query.data === 'l_will_help') {
    const ents = query.message.entities;

    const mention = ents[0];
    if (!mention) { return ctx.answerCbQuery('Неизвестный пользователь'); }

    const { user } = mention;
    const entry = LostEntry.get(user.id);
    if (!entry) { return ctx.answerCbQuery('Это событие уже устарело'); }

    const isOnCase = entry.toggleCase(query.from.id, ctx.getUserTag(query.from));
    if (!isOnCase) { ctx.answerCbQuery('Ты отозвал своё предложение о помощи');  }

    const locationUrl = ents[ents.length - 1].url;
    const content = getMessageContent(user, locationUrl);
    bot.telegram.editMessageText(query.message.chat.id, query.message.message_id, null, content, modKb);
  }

  ctx.answerCbQuery();
});