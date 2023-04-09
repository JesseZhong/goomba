const resolve = (test_file) => {
  const file = require(test_file);
  const handler = require('../../../ssr-build/index.js').handler;

  handler(file).then(
    (response) => console.log(response),
    (reason) => console.error(reason)
  );
};

module.exports = {
  bot: () => resolve('./bot.json'),
  user: () => resolve('./user.json'),
};
