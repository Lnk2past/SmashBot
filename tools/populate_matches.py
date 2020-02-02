import csv
import psycopg2


class GameData:
    def __init__(self, row):
        self.date             = row[0]
        self.player_1         = row[1]
        self.player_2         = row[2]
        self.player_1_fighter = row[3]
        self.player_2_fighter = row[4]
        self.stage            = row[5]
        self.winner           = row[6]
        self.location         = row[7]
        self.type             = row[8]

conn = psycopg2.connect("dbname=SmashStats")
cur = conn.cursor()

cur.execute('SELECT * FROM players')
players = {p[1]:p[0] for p in cur.fetchall()}

with open('matches.txt', newline='') as m:
    match_reader = csv.reader(m, delimiter=',', quotechar='|')
    games = [GameData(row) for row in match_reader]

player_1_wins = 0
player_2_wins = 0
player_1 = games[0].player_1
player_2 = games[0].player_2
location = games[0].location
typ = games[0].type

cur.execute('SELECT id FROM players WHERE name=%s', (player_1,))
player_1_id = cur.fetchone()[0]

cur.execute('SELECT id FROM players WHERE name=%s', (player_2,))
player_2_id = cur.fetchone()[0]

cur.execute('INSERT INTO games(location) VALUES(%s) RETURNING id', (location,))
match_id = cur.fetchone()[0]

for match in games:
    player_1_fighter = match.player_1_fighter
    player_2_fighter = match.player_2_fighter
    cur.execute('SELECT id FROM fighters WHERE name=%s', (player_1_fighter,))
    player_1_fighter_id = cur.fetchone()[0]
    cur.execute('SELECT id FROM fighters WHERE name=%s', (player_2_fighter,))
    player_2_fighter_id = cur.fetchone()[0]

    winner = match.winner
    winner_player_1_flag = False
    winner_player_2_flag = False

    winner_id = None
    if winner == player_1:
        player_1_wins += 1
        winner_id = player_1_id
        winner_player_1_flag = True
    elif winner == player_2:
        player_2_wins += 1
        winner_id = player_2_id
        winner_player_2_flag = True

    cur.execute('INSERT INTO games(match) VALUES(%s) RETURNING id', (match_id,))
    game_id = cur.fetchone()[0]
    cur.execute('INSERT INTO player_fighter_games(game, player, fighter, stage, win) VALUES(%s, %s, %s, 1, %s)', (game_id, player_1_id, player_1_fighter_id, winner_player_1_flag))
    cur.execute('INSERT INTO player_fighter_games(game, player, fighter, stage, win) VALUES(%s, %s, %s, 1, %s)', (game_id, player_2_id, player_2_fighter_id, winner_player_2_flag))

if (player_1_wins > player_2_wins):
    cur.execute('INSERT INTO match_results(match, winner) VALUES(%s, %s)', (match_id, player_1_id))
if (player_2_wins > player_1_wins):
    cur.execute('INSERT INTO match_results(match, winner) VALUES(%s, %s)', (match_id, player_2_id))

conn.commit()
cur.close()
conn.close()
