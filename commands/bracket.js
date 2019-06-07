dbqueries = require('../dbqueries');

module.exports = 
{
    create_matches: async function(pool, discord_msg, content) {
        active_players = await dbqueries.get_active_players(pool);
        console.log('hello')
        console.log(active_players);
        await asyncForEach(active_players, async (player1) => {
            await asyncForEach(active_players, async (player2) => {
                console.log(player1.display_name + " - " + player2.display_name);
            })
        })
        console.log('bye');
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
