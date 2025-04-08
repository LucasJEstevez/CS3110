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
        animalCell.innerText=animals[index]
        soundCell.innerText=sounds[index]
        editCell.innerHTML = `<button onclick="editRow(${index})">Edit</button>`;
        deleteCell.innerHTML = `<button onclick="deleteRow(${index})">Delete</button>`;
    });
}

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

async function editRow(index){
    console.log("edit ",index,"th row");
}

async function deleteRow(index){
    console.log("deleting ",index,"th row");
    console.log(animals)
}

getData().then(r => {
    animals = r[0];
    sounds = r[1];
    updateTable(animals,sounds);
})
