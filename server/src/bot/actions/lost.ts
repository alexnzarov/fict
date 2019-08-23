import AppConfig from '../../config';
import InlineKeyboard from '../utils/InlineKeyboard';
import bot from '..';

bot.command('/lost', (ctx) => ctx.replyWithHTML('Ты потерялся? Ничего, не бойся.\n<b>Отправь мне свою локацию через вложения или нажми на кнопку "Я потерялся", чтобы я смог тебе помочь!</b>'))

const instructions = [
  '<b>Твоя локация была передана в надёжные руки!</b>\n',
  'Оставайся там, где ты оставил(а) метку.',
  'Скоро с тобой свяжутся и помогут с твоей проблемой.\n',
  '<i>Если твоя проблема решилась, пожалуйста, нажми на кнопку "Со мной всё хорошо", чтобы мы не волновались.</i>',
].join('\n');

bot.on('location', (ctx) => {
  const kb = InlineKeyboard(
    [ 
      { 
        text: 'Со мной всё хорошо',
        callback_data: `l_helped_${ctx.from.id}`,
      },
    ]
  );
  
  ctx.replyWithHTML(instructions, kb);
});