import Logger from './@core/Logger';

import app from './app';

app
  .listen(3000, () => {
    Logger.info(`server running on port : 3000`);
  })
  .on('error', (e) => Logger.error(e));
