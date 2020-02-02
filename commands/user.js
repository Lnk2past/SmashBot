dbqueries = require('../dbqueries');

module.exports = 
{
register: async function(pool, discord_msg) {
    var discord_id = discord_msg.author.id;
    var discord_name = discord_msg.author.name;
    player = await dbqueries.get_player_by_discord_id(pool, discord_id);
    if (player.length === 0) {
        await pool.query('INSERT INTO players(name, discord_id) VALUES($1, $2)', [discord_name, discord_id]);
    }
    else {
        discord_msg.channel.send('You are already registered!');
    }
},

update: async function(pool, discord_msg) {
    var discord_id = discord_msg.author.id;
    var discord_name = discord_msg.author.name;
    player = await dbqueries.get_player_by_discord_id(pool, discord_id);
    if (player.length === 0) {
        discord_msg.channel.send('You are not registered yet!');
    }
    else {
        await pool.query('UPDATE players SET name = $1 WHERE discord_id = $2', [discord_name, discord_id]);
    }
}
}
