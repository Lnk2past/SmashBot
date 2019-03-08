# SmashBot
A SSBU Discord bot for tracking and reporting on player statistics

# Database Layout

## Tables

### player:
```
                                               Table "public.player"
 Column |  Type   |                      Modifiers                      | Storage  | Stats target | Description
--------+---------+-----------------------------------------------------+----------+--------------+-------------
 id     | integer | not null default nextval('player_id_seq'::regclass) | plain    |              |
 name   | text    |                                                     | extended |              |
Indexes:
    "unique_player_id" UNIQUE CONSTRAINT, btree (id)
Referenced by:
    TABLE "game" CONSTRAINT "foreign_p1_id" FOREIGN KEY (player1) REFERENCES player(id)
    TABLE "game" CONSTRAINT "foreign_p2_id" FOREIGN KEY (player2) REFERENCES player(id)
    TABLE "game" CONSTRAINT "winner_id" FOREIGN KEY (winner) REFERENCES player(id)
    TABLE "match" CONSTRAINT "winner_id" FOREIGN KEY (winner) REFERENCES player(id)
```

### character:
```
                                               Table "public.character"
 Column |  Type   |                       Modifiers
--------+---------+--------------------------------------------------------
 id     | integer | not null default nextval('character_id_seq'::regclass)
 name   | text    |
Indexes:
    "character_id" UNIQUE, btree (id)
Referenced by:
    TABLE "game" CONSTRAINT "foreign_char1_id" FOREIGN KEY (player1_char) REFERENCES "character"(id)
    TABLE "game" CONSTRAINT "foreign_char2_id" FOREIGN KEY (player2_char) REFERENCES "character"(id)
```

### game:
```
                                               Table "public.game"
    Column    |  Type   |                   Modifiers                   | Storage | Stats target | Description
--------------+---------+-----------------------------------------------+---------+--------------+-------------
 id           | integer | not null default nextval('game_id'::regclass) | plain   |              |
 match_id     | integer |                                               | plain   |              |
 player1      | integer |                                               | plain   |              |
 player2      | integer |                                               | plain   |              |
 player1_char | integer |                                               | plain   |              |
 player2_char | integer |                                               | plain   |              |
 winner       | integer |                                               | plain   |              |
Foreign-key constraints:
    "foreign_char1_id" FOREIGN KEY (player1_char) REFERENCES "character"(id)
    "foreign_char2_id" FOREIGN KEY (player2_char) REFERENCES "character"(id)
    "foreign_match_id" FOREIGN KEY (match_id) REFERENCES match(id)
    "foreign_p1_id" FOREIGN KEY (player1) REFERENCES player(id)
    "foreign_p2_id" FOREIGN KEY (player2) REFERENCES player(id)
    "winner_id" FOREIGN KEY (winner) REFERENCES player(id)
```

### match:
```
                                               Table "public.match"
   Column   |  Type   |                     Modifiers                      | Storage  | Stats target | Description
------------+---------+----------------------------------------------------+----------+--------------+-------------
 id         | integer | not null default nextval('match_id_seq'::regclass) | plain    |              |
 date       | text    |                                                    | extended |              |
 location   | text    |                                                    | extended |              |
 winner     | integer |                                                    | plain    |              |
 match_type | text    |                                                    | extended |              |
Indexes:
    "match_id" UNIQUE, btree (id)
Foreign-key constraints:
    "winner_id" FOREIGN KEY (winner) REFERENCES player(id)
Referenced by:
    TABLE "game" CONSTRAINT "foreign_match_id" FOREIGN KEY (match_id) REFERENCES match(id)
```

## Common Queries

TODO

## TODO
- add common queries
- add random stage selector
- add character query commands
- add game and match reporting/query commands
