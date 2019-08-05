import { ContextMessageUpdate } from 'telegraf';
import AppConfig from '../../config';

const message = [
  `<b>Авторизация на сайте</b> https://${AppConfig.HOST}/\n`,
  'Для того, чтобы авторизоваться на сайте, необходимо нажать на кнопку ниже и разрешить передачу своих данных.',
].join('\n');

export default (ctx: ContextMessageUpdate) => {
  ctx.replyWithHTML(message, { 
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Авторизироваться',
            login_url: {  
              url: `https://${AppConfig.HOST}/api/auth`,
              request_write_access: true,
            }
          } as any
        ]
      ],
    },
  });
};