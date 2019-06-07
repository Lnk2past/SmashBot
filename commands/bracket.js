dbqueries = require('../dbqueries');

module.exports = 
{
    create_matches: async function(pool, discord_msg, content) {
        active_players = dbqueries.get_active_players(pool);

        console.log('hello');

        for (player1 in active_players) {
            for (player2 in active_players) {
                console.log(player1);
                console.log(player2);
                if (player1.player_id != player2.player_id) {
                    console.log(player1.display_name + " - " + player2.display_name);
                }
            }
        }

        console.log('bye');
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
