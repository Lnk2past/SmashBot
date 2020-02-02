import csv
import psycopg2

class MatchData:
    def __init__(self, row):
        self.date     = row[0]
        self.p1       = row[1]
        self.p2       = row[2]
        self.p1char   = row[3]
        self.p2char   = row[4]
        self.winner   = row[5]
        self.location = row[6]
        self.type     = row[7]

conn = psycopg2.connect("dbname=SmashStats")
cur = conn.cursor()

cur.execute('SELECT * FROM players')
players = {p[1]:p[0] for p in cur.fetchall()}

with open('matches.txt', newline='') as m:
    match_reader = csv.reader(m, delimiter=',', quotechar='|')
    matches = [MatchData(row) for row in match_reader]

p1wins = 0
p2wins = 0
date = matches[0].date
p1 = matches[0].p1
p2 = matches[0].p2
location = matches[0].location
typ = matches[0].type

cur.execute('SELECT id FROM players WHERE name=%s', (p1,))
p1id = cur.fetchone()[0]

cur.execute('SELECT id FROM players WHERE name=%s', (p2,))
p2id = cur.fetchone()[0]

cur.execute('INSERT INTO matches(id, date, tournament, location) VALUES(DEFAULT, DEFAULT, NULL, %s) RETURNING id', (location,))
match_id = cur.fetchone()[0]

for match in matches:
    p1char = match.p1char
    p2char = match.p2char
    cur.execute('SELECT id FROM fighters WHERE name=%s', (p1char,))
    p1charid = cur.fetchone()[0]
    cur.execute('SELECT id FROM fighters WHERE name=%s', (p2char,))
    p2charid = cur.fetchone()[0]

    winner = match.winner
    winnerp1_flag = False
    winnerp2_flag = False

    winnerid = None
    if winner == p1:
        p1wins += 1
        winnerid = p1id
        winnerp1_flag = True
    elif winner == p2:
        p2wins += 1
        winnerid = p2id
        winnerp2_flag = True

    cur.execute('INSERT INTO games(match) VALUES(%s) RETURNING id', (match_id,))
    gameid = cur.fetchone()[0]
    g1 =  cur.execute('INSERT INTO player_fighter_games(game, player, fighter, stage, win) VALUES(%s, %s, %s, 1, %s)', (gameid, p1id, p1charid, winnerp1_flag))
    g2 =  cur.execute('INSERT INTO player_fighter_games(game, player, fighter, stage, win) VALUES(%s, %s, %s, 1, %s)', (gameid, p2id, p2charid, winnerp2_flag))

if (p1wins > p2wins):
    cur.execute('INSERT INTO match_results(match, winner) VALUES(%s, %s)', (match_id, p1id))
if (p2wins > p1wins):
    cur.execute('INSERT INTO match_results(match, winner) VALUES(%s, %s)', (match_id, p2id))

conn.commit()
cur.close()
conn.close()