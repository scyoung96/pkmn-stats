let natures;
let sets;

initializeNatures().then((data) => {
    natures = data;
    console.log(natures);

    initializeSets().then((data) => {
        sets = data;
        console.log(sets);
        displayRandomSet();
    });
});

let player1 = document.querySelector("#player-1");
let player2 = document.querySelector("#player-2");
let player3 = document.querySelector("#player-3");
let player4 = document.querySelector("#player-4");
let players = {
    1: player1,
    2: player2,
    3: player3,
    4: player4
}
let currPlayer = player1;

function takePkmn(skip=false) {
    if (!skip) {
        let pkmn = document.querySelector('#pkmn-name').textContent;

        currPlayer.querySelector(".pkmn-list").innerHTML += `
            <div class="pkmn-item">
                <span class="pkmn-name">${pkmn}</span>
            </div>
        `;

        // Move to the next player
        currPlayer.querySelector("h3").classList.remove("active");

        let playerNum = parseInt(currPlayer.id.split("-")[1]);
        playerNum++; // Move to the next player
        if (playerNum > 4) {
            playerNum = 1; // Loop back to player 1
        }
        currPlayer = players[playerNum]; // Update the current player
        currPlayer.querySelector("h3").classList.add("active"); // Highlight the current player
    }

    displayRandomSet();
}

function passPkmn() {
    // Move to the next player
    currPlayer.querySelector("h3").classList.remove("active");

    let playerNum = parseInt(currPlayer.id.split("-")[1]);
    playerNum++; // Move to the next player
    if (playerNum > 4) {
        playerNum = 1; // Loop back to player 1
    }
    currPlayer = players[playerNum]; // Update the current player
    currPlayer.querySelector("h3").classList.add("active"); // Highlight the current player
}

async function initializeSets() {
    return fetch('data/sets.csv').then(response => response.text()).then(data => {
            // Parse CSV data
            const rows = data.split('\n');
            const headers = rows[0].split(',');
            const parsedSets = [];
            
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue; // Skip empty rows
                
                const values = rows[i].split(',');
                const set = {};
                
                for (let j = 0; j < headers.length; j++) {
                    set[headers[j].trim()] = values[j] ? values[j].trim() : '';
                }
                
                parsedSets.push(set);
            }
            
            return parsedSets;
        })
        .catch(error => {
            console.error('Error loading Pokemon sets:', error);
            return [];
        });
}

function initializeNatures() {
    return fetch('data/natures.csv').then(response => response.text()).then(data => {
            // Parse CSV data for natures
            const rows = data.split('\n');
            const headers = rows[0].split(',');
            const parsedNatures = [];
            
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue; // Skip empty rows
                
                const values = rows[i].split(',');
                const nature = {};
                
                for (let j = 0; j < headers.length; j++) {
                    nature[headers[j].trim()] = values[j] ? values[j].trim() : '';
                }
                
                parsedNatures.push(nature);
            }
            
            return parsedNatures;
        })
        .catch(error => {
            console.error('Error loading natures:', error);
            return [];
        });
}

function popRandomSet() {
    if (!sets || sets.length === 0) {
        console.error("No sets available to pop.");
        return null;
    }
    const randomIndex = Math.floor(Math.random() * sets.length);
    const randomSet = sets[randomIndex];
    sets.splice(randomIndex, 1); // Remove the set from the array
    return randomSet;
}

function displayRandomSet() {
    const randomSet = popRandomSet();
    if (!randomSet) {
        document.querySelector('#pkmn-name').textContent = "No more Pokemon available";
        return;
    }
    
    document.querySelector('#pkmn-name').textContent = randomSet.Name;
    document.querySelector('#type1').textContent = randomSet['Type 1'];
    document.querySelector('#type2').textContent = randomSet['Type 2'] ? randomSet['Type 2'] : "";
    document.querySelector('#ability').textContent = randomSet.Ability;
    document.querySelector('#item').textContent = randomSet.Item;
    document.querySelector('#nature').innerHTML = `${randomSet.Nature}<br><span id="nature-modifiers">+${natures.find(nature => nature.Nature === randomSet.Nature)['Plus']}, -${natures.find(nature => nature.Nature === randomSet.Nature)['Minus']}</span>`;
    document.querySelector('#ev-hp').textContent = (randomSet['HP'] ? randomSet['HP'] : "0") + " HP";
    document.querySelector('#ev-atk').textContent = (randomSet['Atk'] ? randomSet['Atk'] : "0") + " Atk";
    document.querySelector('#ev-def').textContent = (randomSet['Def'] ? randomSet['Def'] : "0") + " Def";
    document.querySelector('#ev-spa').textContent = (randomSet['Sp. Atk'] ? randomSet['Sp. Atk'] : "0") + " Sp. Atk";
    document.querySelector('#ev-spd').textContent = (randomSet['Sp. Def'] ? randomSet['Sp. Def'] : "0") + " Sp. Def";
    document.querySelector('#ev-spe').textContent = (randomSet['Spe'] ? randomSet['Spe'] : "0") + " Spe";
    document.querySelector('#move1').textContent = randomSet['Move 1'] ? randomSet['Move 1'] : "None";
    document.querySelector('#move2').textContent = randomSet['Move 2'] ? randomSet['Move 2'] : "None";
    document.querySelector('#move3').textContent = randomSet['Move 3'] ? randomSet['Move 3'] : "None";
    document.querySelector('#move4').textContent = randomSet['Move 4'] ? randomSet['Move 4'] : "None";
}
