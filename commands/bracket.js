dbqueries = require('../dbqueries');

module.exports = 
{
    create_matches: async function(pool, discord_msg, content) {
        tracker = [];
        active_players1 = await dbqueries.get_active_players(pool);
        active_players2 = active_players1;
        await asyncForEach(active_players1, async (player1) => {
            p1id = player1.player_id;
            tracker.push(p1id);
            await asyncForEach(active_players2, async (player2) => {
                p2id = player2.player_id;
                if ((p1id != p2id) && (!tracker.includes(p2id))) {
                    p1 = Math.min(p1id, p2id);
                    p2 = Math.max(p1id, p2id);
                    console.log(player1 + ' --- ' + player2);
                }
            })
        })
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
