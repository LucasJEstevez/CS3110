let nameGiven = false;
let name = '';

async function identify() {
    name = prompt("Name:")
    if (name) {
        nameGiven = true;
        document.getElementById("identifyButton").remove();
    }
}

function startPolling(url) {
    //1.001sec polling
    setInterval(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => updateTable(data))
            .catch(err => console.error(err));
    }, 1001);
}
startPolling('/api');

async function sendMessage(){
    console.log("sendMessage function");
    let message = document.getElementById("msg").value;
    console.log("message: ",message);
    if(nameGiven && message!=''){
        try {
            const response = await fetch('/api', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user:name,msg:message }),
            });
            nameGiven = true;
            document.getElementById("msg").value='';
        } catch (error) {
            console.error(error.message);
        }
    }

}

//Updates webpage table based on new array values (NOT a /api call)
async function updateTable(rows) {
    const tableBody = document.getElementById("table");
    tableBody.innerHTML = ''; // Clear the table body before adding new rows

    rows.forEach((item, index) => {
        const row = tableBody.insertRow();
        const userCell = row.insertCell(0);
        const msgCell = row.insertCell(1)

        userCell.innerText = item.user;
        msgCell.innerText=item.msg;
    });
}
