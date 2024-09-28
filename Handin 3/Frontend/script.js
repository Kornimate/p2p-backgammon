window.onload = Init;

const BASE_URL_GET = "/api/v1/sensors/air-quality/"
const BASE_URL_PUT = "/led-state/"
const BASE_URL_MQTTSTATE = "/api/v1/mqtt-connection"

function Init(){
    document.getElementById("btnLedOn").addEventListener("click", LedOnClicked,false);
    document.getElementById("btnLedOff").addEventListener("click", LedOffClicked,false);

    setInterval(QueryValues, 5000)
}

async function LedOnClicked(){
    await fetch(`${BASE_URL_PUT}1`,{
        method: "PUT",
        headers: {
            'Content-Type' : "application/json"
        }
    });
}

async function LedOffClicked(){
    await fetch(`${BASE_URL_PUT}0`,{
        method: "PUT",
        headers: {
            'Content-Type' : "application/json"
        }
    });
}

async function QueryValues(){
    const queryText = document.getElementById("lastQueried");

    queryText.innerHTML = "Loading...";

    try{
        queryText.style.color="gray";

        const co2_object = await FetchValue(BASE_URL_GET, "co2");
        const tvoc_object = await FetchValue(BASE_URL_GET, "tvoc");
        const state = await FetchValue(BASE_URL_MQTTSTATE,"");

        queryText.innerHTML = `Last Queried (${(new Date()).toLocaleString()})`

        document.getElementById("co2").innerHTML = `${co2_object.value} (${(new Date(co2_object.createdDate)).toLocaleString()})`;
        document.getElementById("tvoc").innerHTML = `${tvoc_object.value} (${(new Date(tvoc_object.createdDate)).toLocaleString()})`;

        if(state.alive){
            document.getElementById("indicator").style.backgroundColor = "green";
        } else {
            document.getElementById("indicator").style.backgroundColor = "red";
        }

    } catch(error) {
        queryText.style.color="red";
        queryText.innerHTML = "Failed to fetch data";
        document.getElementById("co2").innerHTML = "-";
        document.getElementById("tvoc").innerHTML = "-";
    }
}

async function FetchValue(base_url, endpoint){
    const query = await fetch(`${base_url}${endpoint}`);

    if(!query.ok)
        throw new Error("Error while fetching data")

    return (await query.json());
}

QueryValues()