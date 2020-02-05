module.exports = 
{
    // players queries
    get_players: async function(pool) {
        var res = await pool.query('SELECT * FROM players');
        return res.rows;
    },
    get_active_players: async function(pool) {
        var res = await pool.query('SELECT * FROM players WHERE player.active=true');
        return res.rows;
    },
    get_player_by_name: async function(pool, player_name) {
        var res = await pool.query('SELECT id,name FROM players WHERE LOWER(name)=LOWER($1)', [player_name]);
        return [res.rows[0].id, res.rows[0].name];
    },
    get_player_by_discord_id: async function(pool, discord_id) {
        var res = await pool.query('SELECT id,name FROM players WHERE discord_id=$1', [discord_id]);
        return res.rows;
    },

    // fighters queries
    get_fighters: async function(pool) {
        var res = await pool.query('SELECT * FROM fighters');
        return res.rows;
    },
    get_fighter_by_name: async function(pool, fighter_name) {
        var res = await pool.query('SELECT * FROM fighters WHERE LOWER(name)=LOWER($1)', [fighter_name]);
        return [res.rows[0].id, res.rows[0].name];
    },

    // ...
    get_games_played_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT * from game_data WHERE player=$1', [player_id]);
        return res.rows;
    },
    get_games_won_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT * from game_data WHERE player=$1 AND win=true', [player_id]);
        return res.rows;
    },
    get_games_by_id: async function(pool, game_id) {
        var res = await pool.query('SELECT * FROM game_data WHERE game=$1', [game_id]);
        return res.rows;
    },
    get_games_played_by_player_as_fighter: async function(pool, player_id, fighter_id) {
        var res = await pool.query('SELECT * from game_data WHERE player=$1 AND fighter=$2', [player_id, fighter_id]);
        return res.rows;
    },

    // matches queries
    get_matches_played_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT * from match_data WHERE player=$1', [player_id]);
        return res.rows;
    },
    get_matches_won_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT * from match_data WHERE player=$1 AND win=true', [player_id]);
        return res.rows;
    },

//     // matches queries
//     get_match_by_id: async function(pool, match_id) {
//         var res = await pool.query('SELECT * FROM matches WHERE match_id=$1', [match_id]);
//         return res.rows;
//     },
//     get_matches_played_by_player: async function(pool, player_id) {
//         var res = await pool.query('SELECT COUNT(DISTINCT match.match_id) FROM match LEFT JOIN game ON game.match_id=match.match_id LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE pcg.player_id=$1', [player_id]);
//         return res.rows[0].count;
//     },
//     get_matches_to_be_played_by_player: async function(pool, player_id) {
//         var res = await pool.query('SELECT COUNT(DISTINCT match.match_id) FROM match LEFT JOIN game ON game.match_id=match.match_id LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE pcg.player_id=$1 AND match.match_status="scheduled"', [player_id]);
//         return res.rows[0].count;
//     },
//     get_matches_won_by_player: async function(pool, player_id) {
//         var res = await pool.query('SELECT COUNT(*) FROM match WHERE winner=$1', [player_id]);
//         return res.rows[0].count;
//     },
//     get_matches_played_by_player_during_period_with_type: async function(pool, player_id, date_1, date_2, type) {
//         var res = await pool.query('SELECT DISTINCT match.match_id FROM match LEFT JOIN game ON game.match_id=match.match_id LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE pcg.player_id=$1 AND date>=$2 AND date<=$3 AND match_type=$4', [player_id, date_1, date_2, type]);
//         return res.rows;
//     },

//     // bracket queries
//     get_players_in_match: async function(pool, match_id) {
//         var res = await pool.query('SELECT DISTINCT pcg.player_id FROM match LEFT JOIN game ON game.match_id=match.match_id LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE match.match_id=$1', [match_id]);
//         return res.rows;
//     },
//     get_latest_weekly_date: async function(pool) {
//         var res = await pool.query('SELECT * FROM weekly_dates ORDER BY weekly_id DESC LIMIT 1');
//         return res.rows[0];
//     },
//     insert_latest_weekly_date: async function(pool, date, season) {
//         var res = await pool.query('INSERT into weekly_dates(weekly_id, date, season) VALUES(DEFAULT, $1, $2) returning date', [date, season]);
//         return res.rows;
//     }
}