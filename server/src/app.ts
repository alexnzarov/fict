import express from 'express';
import logger from './core/Logger';
import AuthMiddleware from './middlewares/auth';

const app = express();
export default app;

app.use(AuthMiddleware);

app.set('json spaces', 2);

const port = process.env.PORT || 8000;
app.listen(port, () => logger.info('Server is listening on', port, 'port'));

import './routes';

