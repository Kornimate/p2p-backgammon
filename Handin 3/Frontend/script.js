window.onload = Init;

const BASE_URL_GET = "http://localhost:8080/api/v1/sensors/air-quality/"
const BASE_URL_PUT = "http://localhost:8080/led-state/"

function Init(){
    document.getElementById("btnLedOn").addEventListener("click", LedOnClicked,false);
    document.getElementById("btnLedOff").addEventListener("click", LedOffClicked,false);

    // setInterval(QueryValues, 5000)
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

        queryText.innerHTML = `Last Queried (${(new Date()).toLocaleString()})`

        document.getElementById("co2").innerHTML = co2_object.value;
        document.getElementById("tvoc").innerHTML = tvoc_object.value;
    } catch(error) {
        queryText.style.color="red";
        queryText.innerHTML = "Failed to fetch data";
        document.getElementById("co2").innerHTML = "-";
        document.getElementById("tvoc").innerHTML = "-";
    }
}

async function FetchValue(endpoint){
    const query = await fetch(`${BASE_URL_GET}${endpoint}`);

    console.log(query)

    if(!query.ok)
        throw new Error("Error while fetching tvoc")

    return (await query.json());
}