function GetPlayerName(){
    let name = localStorage.getItem("playerName");
    
    if(!name){
        const randomness = 100000000;
        name = `User-${Math.floor(Math.random()*randomness)+1}`;
        localStorage.setItem("playerName", name);
    }
    
    return name;
}

function GetPlayerGames(){
    return GetPlayerStat("Game");
}

function GetPlayerWins(){
    return GetPlayerStat("Game");
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

export {GetPlayerName, GetPlayerGames, GetPlayerWins};