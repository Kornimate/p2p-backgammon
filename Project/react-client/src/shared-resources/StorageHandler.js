function GetPlayerName(){
    let name = localStorage.getItem("playerName");
    
    if(!name){
        const randomness = 100000000;
        name = `User-${Math.floor(Math.random()*randomness)+1}`;
        localStorage.setItem("playerName", name);
    }
    
    return name;
}

function SetPlayerName(name){
    localStorage.setItem("playerName", name);
}

function GetPlayerGames(){
    return GetPlayerStat("Game");
}

function SetPlayerGames(value){
    SetPlayerStat("Game", value)
}

function GetPlayerWins(){
    return GetPlayerStat("Win");
}

function SetPlayerWins(value){
    SetPlayerStat("Win", value);
}

function IncreasePlayerGames(){
    SetPlayerGames(GetPlayerGames() + 1);
}

function IncreasePlayerWins(){
    SetPlayerWins(GetPlayerWins() + 1);
}


function GetPlayerStat(statName){
    const statKey = GetPlayerName() + "-" + statName;

    let value = localStorage.getItem(statKey);

    if(!value){
        localStorage.setItem(statKey, 0);
        value = 0;
    }

    return value;
}

function SetPlayerStat(statName, newValue){
    const statKey = GetPlayerName() + "-" + statName;

    localStorage.setItem(statKey, newValue);
}

function GetToken(){
    return localStorage.getItem("Token");
}

function SetToken(token){
    localStorage.setItem("Token",token);
}

export {GetPlayerName, SetPlayerName, GetPlayerGames, GetPlayerWins, GetPlayerStat, GetToken, SetToken, IncreasePlayerGames, IncreasePlayerWins};