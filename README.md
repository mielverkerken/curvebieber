# groep-11 - CurveBieber
Miel Verkerken - Robin Dejonckheere

# FUNCTIONALITY
Our webapplication CurveBieber is a game based on the CurveFever game.

Every player has a snake - or curve - which is controlled by the left and right arrow keys.
The curve moves at a constant speed in the playing field.
The goal of the game is to survive as long as possible in each round of the game.
When your curve hits another curve or the edge of the playing field, you die.
The first players that dies gets zero points, the second one, the third two,...
Every round, the playing field is cleared and every player starts with a new curve.
At the end of the game, the players scores are added to the points of their account.

# SETUP APPLICATION
1. clone github
2. execute `cd groep-11`
3. execute `docker-compose up`


# HOW TO PLAY
1. Browse to [our webpage](http://localhost:3000).
2. Register a new user, submit your name and credentials.
3. Login with your credentials.
4. Go to the Lobby.
5. Create a new Game, choose a name, number of rounds and number of players.
    If you want to play with more then one player, you should play it over a LAN
    on different pc's because only one player is allowed to play in one browser window.
    You could play with 2 players without a network if you make 2 users and log one of them in
    in an incognito browser window. Of course it's only possible to use the arrow keys in one
    window at the same time, so the other player will go straight forward and die soon.
6. Join the game, it will start automatically when the correct number of players join.
7. Press the left or right arrow to turn and try to survive as long as possible!
    Holes in the curves make it possible to escape if you get stuck.
8. When the game is ended, go back to the lobby to play another game or go to the ranking
   page to see your total points.

# IMPLEMENTATION
- Our webapplication is developed using in Node.js Express.
- We use Redis as a database for the users and games.
- We use websockets from Socket.IO to communicate with the clients:
    - The lobby is updated every time a new game is added or a game ended.
    - Each game has its own room (channel) where all the players join.
    - The players send messages to the server when one of the arrow buttons is
      pressed or released.
    - The server calculates the new coordinates for every living player in a room and
      broadcasts them to all the players.
    - The client draws the next part of the curve based on the coordinates received from
      the server.
    - Every client checks for itself if his user is dead by looking at the color of his newly
      calculated coordinates. When this happens, he sends a message to the server.
      We wanted to check this serverside but failed to install the node-canvas module
      so we could simulate the playing field on the server.
- We use REST to post newly created games and to get the ranking.
  Other REST services are provided but not used. (See below)
- We use forms to register and login users.
- We use pug with bootstrap for our webview.

# REST - json
url | method | description
--- | --- | ---
/api/user | GET | all users
/api/user | POST | add new user
/api/user/`nickname` | GET | get user with `nickname`
/api/user/`nickname` | POST | update user with `nickname`
/api/game | GET | all games
/api/game | POST | add new game
/api/game/`id` | GET | get game with `id`
/api/game/`id` | POST | update game with `id`

# PATH
url | description
--- | ---
/ | homepage
/register | register useraccount (form)
/login | user login (form)
/lobby | all open games in list, option to create new game with pop-up, join game
/game | canvas with curve
/rank | ranking of all registered users, based on points

