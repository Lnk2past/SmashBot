import csv
import psycopg2

conn = psycopg2.connect("dbname=SmashStats")
cur = conn.cursor()

with open('fighters.csv') as f:
    fighter_reader = csv.reader(f, delimiter=',', quotechar='|')
    for fighter in fighter_reader:
        cur.execute('INSERT INTO fighters(name) VALUES(%s)', (fighter,))

with open('stages.csv') as f:
    stage_reader = csv.reader(f, delimiter=',', quotechar='|')
    for stage in stage_reader:
        cur.execute('INSERT INTO stages(name) VALUES(%s)', (stage,))

conn.commit()
cur.close()
conn.close()