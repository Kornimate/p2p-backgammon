window.onload = Initialization;

async function Initialization(){

    await QueryFunction();

    setInterval(QueryFunction, 10000); //update every 10 sec
}

async function QueryFunction(){

    const queryTime = document.getElementById("lastQueryTime");

    queryTime.innerHTML = "Loading...";

    let success = false;

    try{
        
        const resAwaitbale = await fetch("https://ezdata2.m5stack.com/api/v2/<owndata>");

        success = resAwaitbale.ok;
    
        const jsonData = await resAwaitbale.json();
            
        PrintTableData(true, jsonData);
        
    }
    catch{
        PrintTableData();
    }

    queryTime.innerHTML = ` ${(new Date()).toLocaleString()} ${success ? "✅" : "❌"}`;
}

function PrintTableData(successfulQuery = false, jsonData){
    
    const table = document.getElementById("tableBody");

    if(!successfulQuery){
        table.innerHTML = '<tr><td colspan="3" class="error-text">Failed to fetch data</td></tr>';

        return;
    }

    let content = "";

    jsonData.forEach(item => {        
        content += `<tr><td>${item?.time}</td><td>${item?.type}</td><td>${item?.value}</td></tr>`;
    });

    table.innerHTML = content;
}