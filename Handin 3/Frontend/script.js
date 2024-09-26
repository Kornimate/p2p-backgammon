window.onload = Init;

const BASE_URL_GET = "http://localhost:8080/api/v1/sensors/air-quality/"
const BASE_URL_PUT = "http://localhost:8080/led-state/"

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

        const co2_object = await FetchValue("co2");
        const tvoc_object = await FetchValue("tvoc");

        console.log(co2_object)
        console.log(tvoc_object)

        queryText.innerHTML = `Last Queried (${(new Date()).toLocaleString()})`

        document.getElementById("co2").innerHTML = `${co2_object.value} (${(new Date(co2_object.createdDate)).toLocaleString()})`;
        document.getElementById("tvoc").innerHTML = `${tvoc_object.value} (${(new Date(tvoc_object.createdDate)).toLocaleString()})`;
    } catch(error) {
        queryText.style.color="red";
        queryText.innerHTML = "Failed to fetch data";
        document.getElementById("co2").innerHTML = "-";
        document.getElementById("tvoc").innerHTML = "-";
    }
}

async function FetchValue(endpoint){
    const query = await fetch(`${BASE_URL_GET}${endpoint}`);

    if(!query.ok)
        throw new Error("Error while fetching data")

    return (await query.json());
}

QueryValues()