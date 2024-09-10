window.onload = Initialization;

async function Initialization(){

    await QueryFunction();

    setInterval(QueryFunction, 10000); //update every 10 sec
}

async function QueryFunction(){

    const queryTime = document.getElementById("lastQueryTime");

    queryTime.innerHTML = "Loading...";

    try{
        
        const resAwaitbale = await fetch("https://ezdata2.m5stack.com/api/v2/<owndata>");
    
        const jsonData = await resAwaitbale.json();
            
        PrintTableData(true, jsonData);
        
    }
    catch{
        PrintTableData(false, null);
    }

    queryTime.innerHTML = `${new Date()}`;
}

function PrintTableData(successfulQuery = false, jsonData){
    
    const table = document.getElementById("tableBody");

    if(!successfulQuery){
        table.innerHTML = '<tr><td colspan="3" class="error-text">Failed to fetch data</td></tr>';

        return;
    }

    let content = "";

    for(const key in jsonData){
        //code comes here

        content += `<tr><td>${}</td><td>${}</td><td>${}</td></tr>`;
    }

    table.innerHTML = content;
}