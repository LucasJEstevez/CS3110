//GET Request to server for table data
async function getData() {
    try {
        const response = await fetch('/api');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        animals = json.animals
        console.log("animals: ", animals)
        sounds = json.sounds
        console.log("sounds: ", sounds)

        return [json.animals,json.sounds]
    } catch (error) {
        console.error(error.message);
    }
}

//Updates webpage table based on new array values (NOT a /api call)
async function updateTable(animals, sounds) {
    console.log("updateTable")
    console.log("animals: ",animals)
    console.log("sounds: ",sounds)
    const tableBody = document.getElementById("table");
    tableBody.innerHTML = ''; // Clear the table body before adding new rows

    animals.forEach((item, index) => {
        const row = tableBody.insertRow();
        const indexCell = row.insertCell(0);
        const animalCell = row.insertCell(1);
        const soundCell = row.insertCell(2);
        const editCell = row.insertCell(3);
        const deleteCell = row.insertCell(4);

        indexCell.innerText = index;
        animalCell.innerText=animals[index];
        soundCell.innerText=sounds[index];
        editCell.innerHTML = `<button onclick="editRow(${index})">Edit</button>`;
        deleteCell.innerHTML = `<button onclick="deleteRow(${index})">Delete</button>`;
    });
}

//Adds new entry (POST)
async function addRow() {
    let name = prompt("Name of animal:")
    let sound = prompt("Sound of animal:")
    try {
        const response = await fetch('/api', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animal:name, sound:sound }),
        });
    } catch (error) {
        console.error(error.message);
    }
    getData().then(r => {
        animals = r[0];
        sounds = r[1];
        updateTable(animals,sounds);
    })


}

//Edits entry (PUT)
async function editRow(index){
    console.log("edit ",index,"th row");

    let name = prompt("Name of animal:")
    let sound = prompt("Sound of animal:")
    try {
        const response = await fetch('/api', {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ animal:name, sound:sound, index:index }),
        });
    } catch (error) {
        console.error(error.message);
    }
    getData().then(r => {
        animals = r[0];
        sounds = r[1];
        updateTable(animals,sounds);
    })
}

//Removes row (DELETE)
async function deleteRow(index){
    try {
        const response = await fetch('/api', {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ index:index }),
        });
    } catch (error) {
        console.error(error.message);
    }
    getData().then(r => {
        animals = r[0];
        sounds = r[1];
        updateTable(animals,sounds);
    })
}

//Initial gathering of data
getData().then(r => {
    animals = r[0];
    sounds = r[1];
    updateTable(animals,sounds);
})
