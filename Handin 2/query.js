window.onload = Initialization;

async function Initialization() {

    await QueryFunction();

    setInterval(QueryFunction, 10000); //update every 10 sec
}

async function QueryFunction() {

    const queryTime = document.getElementById("lastQueryTime");

    queryTime.innerHTML = "Loading...";

    let success_co2 = false;

    try {

        const resAwaitbale_co2 = await fetch("https://ezdata2.m5stack.com/api/v2/23898346e6474e2eaa2d7ff096d121cd/history");
        const resAwaitbale_TVOC = await fetch("https://ezdata2.m5stack.com/api/v2/34af158ff39e4f0d81fa8c4a118b7722/history")

        success_co2 = resAwaitbale_co2.ok;
        success_TVOC = resAwaitbale_TVOC.ok

        const jsonData_co2 = await resAwaitbale_co2.json();
        const jsonData_TVOC = await resAwaitbale_TVOC.json();

        update_min_max_now(jsonData_co2, jsonData_TVOC);

        PrintTableData("tableBodyCo2", success_co2, jsonData_co2);
        PrintTableData("tableBodyTVOC", success_TVOC, jsonData_TVOC);


    }
    catch {
        PrintTableData("tableBodyCo2", false);
        PrintTableData("tableBodyTVOC");
    }

    queryTime.innerHTML = ` ${(new Date()).toLocaleString()} ${success_co2 && success_TVOC ? "✅" : "❌"}`;
}

function PrintTableData(elementName, successfulQuery, jsonData) {

    const table = document.getElementById(elementName);

    if (!successfulQuery) {
        table.innerHTML = '<tr><td colspan="3" class="error-text">Failed to fetch data</td></tr>';

        return;
    }

    let content = "";

    jsonData.data.rows.forEach(item => {
        content += `<tr><td>${item?.updateTime}</td><td>${(item?.name).substring(0, item?.name.indexOf("_"))}</td><td>${item?.value}</td></tr>`;
    });

    table.innerHTML = content;
}



function find_min_and_max(jsonData){
    values = jsonData.data.rows.map(item => item.value);
    min = Math.min(...values);
    max = Math.max(...values);
    return [min, max];
}

function update_min_max_now(jsonData_co2, jsonData_TVOC){
    let co2_min_max = find_min_and_max(jsonData_co2);
    let TVOC_min_max = find_min_and_max(jsonData_TVOC);
    let now_co2 = jsonData_co2.data.rows[0].value;
    let now_TVOC = jsonData_TVOC.data.rows[0].value;
    
    document.getElementById("min_co2").innerHTML = co2_min_max[0];
    document.getElementById("max_co2").innerHTML = co2_min_max[1];
    document.getElementById("min_TVOC").innerHTML = TVOC_min_max[0];
    document.getElementById("max_TVOC").innerHTML = TVOC_min_max[1];
    document.getElementById("now_co2").innerHTML = now_co2
    document.getElementById("now_TVOC").innerHTML = now_TVOC
}