var dirs = 'nesw';

function bot(state, callback) {
    var i = Math.floor(Math.random() * 4);
    var dir = dirs[i];
    callback(null, dir);
};

module.exports = bot;
if (require.main === module)
    require('vindinium-client').cli(bot);
