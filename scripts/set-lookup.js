
let natures;
let sets;

initializeNatures().then((data) => {
    natures = data;
    console.log(natures);

    initializeSets().then((data) => {
        sets = data;
        console.log(sets);
    });
});



async function findSet() {
    if (event.key === "Enter") {
        const pkmnSearch = document.getElementById("pkmn-search").value.trim();
        if (!pkmnSearch) {
            return;
        }
        
        const set = sets.find(s => s['Name'].toLowerCase() === pkmnSearch.toLowerCase());
        if (!set) {
            alert(`No set found for ${pkmnSearch}`);
            return;
        }

        console.log(`Found set for ${pkmnSearch}:`, set);
        displaySet(set);
    }
}

function displaySet(set) {
    document.querySelector('#pkmn-name').textContent = set.Name;
    document.querySelector('#type1').textContent = set['Type 1'];
    document.querySelector('#type2').textContent = set['Type 2'] ? set['Type 2'] : "";
    document.querySelector('#ability').textContent = set.Ability;
    document.querySelector('#item').textContent = set.Item;
    document.querySelector('#nature').innerHTML = `${set.Nature}<br><span id="nature-modifiers">+${natures.find(nature => nature.Nature === set.Nature)['Plus']}, -${natures.find(nature => nature.Nature === set.Nature)['Minus']}</span>`;
    document.querySelector('#ev-hp').textContent = (set['HP'] ? set['HP'] : "0") + " HP";
    document.querySelector('#ev-atk').textContent = (set['Atk'] ? set['Atk'] : "0") + " Atk";
    document.querySelector('#ev-def').textContent = (set['Def'] ? set['Def'] : "0") + " Def";
    document.querySelector('#ev-spa').textContent = (set['Sp. Atk'] ? set['Sp. Atk'] : "0") + " Sp. Atk";
    document.querySelector('#ev-spd').textContent = (set['Sp. Def'] ? set['Sp. Def'] : "0") + " Sp. Def";
    document.querySelector('#ev-spe').textContent = (set['Spe'] ? set['Spe'] : "0") + " Spe";
    document.querySelector('#move1').textContent = set['Move 1'] ? set['Move 1'] : "None";
    document.querySelector('#move2').textContent = set['Move 2'] ? set['Move 2'] : "None";
    document.querySelector('#move3').textContent = set['Move 3'] ? set['Move 3'] : "None";
    document.querySelector('#move4').textContent = set['Move 4'] ? set['Move 4'] : "None";
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

async function initializeSets() {
    let currSets = await fetch('data/sets.csv').then(response => response.text()).then(data => {
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

    let oldSets = await fetch('data/old_sets.csv').then(response => response.text()).then(data => {
            // Parse CSV data for old sets
            const rows = data.split('\n');
            const headers = rows[0].split(',');
            const parsedOldSets = [];
            
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue; // Skip empty rows
                
                const values = rows[i].split(',');
                const set = {};
                
                for (let j = 0; j < headers.length; j++) {
                    set[headers[j].trim()] = values[j] ? values[j].trim() : '';
                }
                
                parsedOldSets.push(set);
            }
            
            return parsedOldSets;
        })
        .catch(error => {
            console.error('Error loading old Pokemon sets:', error);
            return [];
        });

    // Combine current and old sets
    const combinedSets = [...currSets, ...oldSets];
    return combinedSets;
}


