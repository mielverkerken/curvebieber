# groep-11 - curve
Miel Verkerken - Robin Dejonckheere

# REST - json
url | methond | description
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
/register | register useraccount (formulier)
/login | user login (formulier)
/lobby | all open games in list, option to create new game with pop-up, join game
/game | canvas with curve 
