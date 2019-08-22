import AppConfig from '../../config';
import InlineKeyboard from '../utils/InlineKeyboard';
import bot from '..';

bot.command('/lost', (ctx) => {

});

bot.on('location', (ctx) => {
  const kb = InlineKeyboard(
    [ { 
      text: 'Мне помогли',
      callback_data: `l_helped_${ctx.from.id}`
    } ], 
    [ { 
      text: 'Отменить',
      callback_data: `l_canceled_${ctx.from.id}`
    } ], 
  );
  ctx.reply(`<b>Я передал твою локацию, теперь стой на месте!</b>\n\nВ скором времени к тебе подойдут, чтобы помочь, или свяжутся через личные сообщения.`, kb);
  ctx.replyWithLocation(ctx.message.location.latitude, ctx.message.location.longitude);
});