module.exports = 
{
    get_players: async function(pool) {
        var res = await pool.query('SELECT * FROM player');
        return res.rows;
    },
    get_primary_player: async function(pool, player_name) {
        var res = await pool.query('SELECT player_id,display_name FROM player WHERE player_name=$1', [player_name]);
        return [res.rows[0].player_id, res.rows[0].display_name];
    },
    get_characters: async function(pool) {
        var res = await pool.query('SELECT * FROM character');
        return res.rows;
    },
    get_primary_character: async function(pool, character_name) {
        var res = await pool.query('SELECT * FROM character WHERE character_name=$1', [character_name]);
        return res.rows[0].character_id;;
    },
    get_games_played_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT game.game_id FROM game LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE pcg.player_id=$1 ORDER BY game.game_id', [player_id]);
        return res.rows;
    },
    get_pcgs_from_games_ordered: async function(pool, game_id, player_id) {
        var res = await pool.query('SELECT * FROM pcg WHERE game_id=$1 ORDER BY CASE player_id WHEN $2 THEN 1 ELSE 2 END', [game_id, player_id]);
        return res.rows;
    },
    get_pcgs_played_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT * FROM pcg WHERE player_id=$1', [player_id]);
        return res.rows;
    },
    get_pcgs_played_by_player_as_char: async function(pool, player_id, character_id) {
        var res = await pool.query('SELECT * FROM pcg WHERE player_id=$1 AND character_id=$2', [player_id, character_id]);
        return res.rows[0].count;
    },
    get_pcgs_won_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT COUNT(*) FROM pcg WHERE player_id=$1 and win=true', [player_id]);
        return res.rows[0].count;
    },
    get_matches_played_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT COUNT(DISTINCT match.match_id) FROM match LEFT JOIN game ON game.match_id=match.match_id LEFT JOIN pcg ON pcg.game_id=game.game_id WHERE pcg.player_id=$1', [player_id]);
        return res.rows[0].count;;
    },
    get_matches_won_by_player: async function(pool, player_id) {
        var res = await pool.query('SELECT COUNT(*) FROM match WHERE winner=$1', [player_id]);
        return res.rows[0].count;
    },
}