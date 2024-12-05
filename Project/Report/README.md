# ToDo list of the project

# Networking
* networking diagram of peers and server, database
* sign up & log in
    * no forgot password feature
* are usernames unique? yes
* does the username get displayed while playing? yes
* can a user see/search for other users? no 
* restrictions on password? 
* connecting by peerID -> can be same account

# Matchmaking
* How are players matched?      **Mikkel**
* waiting time in queue 
    * 30 sec timeout 
* are you notified if you are the only player on the server/no match could be found/...
* do you have to accept a game or does the game instantly start as soon as a match is found? instantly
* how are peers from the same league chosen? randomly/sorted list/... **Mikkel**
* what happens after win/loss? what page are you rerouted to? 
* how is decided which color the player gets
* loosing connection : alert, reroute to home page, game doesnt count
* only wins count

# Security
* since you can manipulate your num of wins, can you also manipulate statistics of other players? **Mikkel**
* how are passwords stored? do we salt them?
* do we generate any keys for the users?
* can adversary influence playing stones on the board during a match?
* checking for legal moves **Arina**

# General
* complete list of stuff that doesnt work/is not implemented
    * dice roll for start
    * double when same number gets rolled
    * statics page
* screenshots from different pages
* how would we implement the statistics? how would looking up statistics work?erent pages and maybe queue
* computational costs? (minimal num of messages sent during a game? num of operations per player per game?)
    * 7 per turn
* introduction **Arina**
* evaluation
* discussion
* literature