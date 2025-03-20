let hpInput;
let hpBaseDiv;
let hpDisplay;
let atkInput;
let atkBaseDiv;
let atkDisplay;
let defInput;
let defBaseDiv;
let defDisplay;
let spAtkInput;
let spAtkBaseDiv;
let spAtkDisplay;
let spDefInput;
let spDefBaseDiv;
let spDefDisplay;
let speInput;
let speBaseDiv;
let speDisplay;

let currPkmnName;
let baseHP = 0;
let baseAtk = 0;
let atkNature = 1;
let baseDef = 0;
let defNature = 1;
let baseSpAtk = 0;
let spAtkNature = 1;
let baseSpDef = 0;
let spDefNature = 1;
let baseSpe = 0;
let speNature = 1;

let allPokemon = []; // Store all Pokemon names

// ANCHOR: nature modifier buttons
let atkMinusButton = document.getElementById("atk-nature-minus");
let atkPlusButton = document.getElementById("atk-nature-plus");
let defMinusButton = document.getElementById("def-nature-minus");
let defPlusButton = document.getElementById("def-nature-plus");
let spAtkMinusButton = document.getElementById("spatk-nature-minus");
let spAtkPlusButton = document.getElementById("spatk-nature-plus");
let spDefMinusButton = document.getElementById("spdef-nature-minus");
let spDefPlusButton = document.getElementById("spdef-nature-plus");
let speMinusButton = document.getElementById("spe-nature-minus");
let spePlusButton = document.getElementById("spe-nature-plus");

let natureModifierButtons = document.querySelectorAll(".nature-modifier-button");
natureModifierButtons.forEach(button => {
    button.addEventListener("click", function() {
        let siblings = this.parentElement.querySelectorAll(".nature-modifier-button");
        siblings.forEach(sib => {
            if (sib !== this) sib.classList.remove("active");
        });

        this.classList.toggle("active");

        let data = this.getAttribute("id").split("-");
        let active = this.classList.contains("active");
        let stat = data[0];
        let modifier;

        if (active) {
            modifier = data[2] === "minus" ? 0.9 : 1.1;
        } else {
            modifier = 1;
        }

        switch (stat) {
            case "atk":
                atkNature = modifier;
                break;
            case "def":
                defNature = modifier;
                break;
            case "spatk":
                spAtkNature = modifier;
                break;
            case "spdef":
                spDefNature = modifier;
                break;
            case "spe":
                speNature = modifier;
                break;
        }

        processStats();
    });
});

// ANCHOR: add to team button
let addToTeamButton = document.getElementById("add-to-team");
addToTeamButton.addEventListener("click", function() {
    let team = JSON.parse(localStorage.getItem("team")) || [];
    let currPkmn = {
        name: currPkmnName,
        stats: {
            hp: {
                ev: hpInput.value,
                value: calcStat("hp", baseHP, 31, hpInput.value, 50, 1)
            },
            atk: {
                ev: atkInput.value,
                nature: atkNature,
                value: calcStat("atk", baseAtk, 31, atkInput.value, 50, atkNature)
            },
            def: {
                ev: defInput.value,
                nature: defNature,
                value: calcStat("def", baseDef, 31, defInput.value, 50, defNature)
            },
            spatk: {
                ev: spAtkInput.value,
                nature: spAtkNature,
                value: calcStat("spatk", baseSpAtk, 31, spAtkInput.value, 50, spAtkNature)
            },
            spdef: {
                ev: spDefInput.value,
                nature: spDefNature,
                value: calcStat("spdef", baseSpDef, 31, spDefInput.value, 50, spDefNature)
            },
            spe: {
                ev: speInput.value,
                nature: speNature,
                value: calcStat("spe", baseSpe, 31, speInput.value, 50, speNature)
            }
        }
    };
    // replace this pkmn in the team if it already exists
    let index = team.findIndex(pkmn => pkmn.name === currPkmnName);
    if (index !== -1) {
        team[index] = currPkmn;
        
        let pkmnDiv = document.querySelector(`.${currPkmnName}`);
        pkmnDiv.remove();
        addPkmnToTeam(currPkmn);
    } else {
        team.push(currPkmn);
        addPkmnToTeam(currPkmn);
    }
    localStorage.setItem("team", JSON.stringify(team));

    updateRemainingPoints();
});

function processStats() {
    let hpEVs = hpInput.value;
    let atkEVs = atkInput.value;
    let defEVs = defInput.value;
    let spAtkEVs = spAtkInput.value;
    let spDefEVs = spDefInput.value;
    let speEVs = speInput.value;

    // remove leading zeros
    hpInput.value = hpInput.value === "" ? 0 : hpInput.value === "0" ? 0 : hpInput.value.replace(/^0+/, '');
    atkInput.value = atkInput.value === "" ? 0 : atkInput.value === "0" ? 0 : atkInput.value.replace(/^0+/, '');
    defInput.value = defInput.value === "" ? 0 : defInput.value === "0" ? 0 : defInput.value.replace(/^0+/, '');
    spAtkInput.value = spAtkInput.value === "" ? 0 : spAtkInput.value === "0" ? 0 : spAtkInput.value.replace(/^0+/, '');
    spDefInput.value = spDefInput.value === "" ? 0 : spDefInput.value === "0" ? 0 : spDefInput.value.replace(/^0+/, '');
    speInput.value = speInput.value === "" ? 0 : speInput.value === "0" ? 0 : speInput.value.replace(/^0+/, '');

    validateEVValues();

    hpEVs = hpInput.value;
    atkEVs = atkInput.value;
    defEVs = defInput.value;
    spAtkEVs = spAtkInput.value;
    spDefEVs = spDefInput.value;
    speEVs = speInput.value;

    // update the stats
    hpDisplay.innerHTML = "HP: " + calcStat("hp", baseHP, 31, hpEVs, 50, 1);
    hpBaseDiv.innerHTML = baseHP;
    atkDisplay.innerHTML = "ATK: " + calcStat("atk", baseAtk, 31, atkEVs, 50, atkNature);
    atkBaseDiv.innerHTML = baseAtk;
    defDisplay.innerHTML = "DEF: " + calcStat("def", baseDef, 31, defEVs, 50, defNature);
    defBaseDiv.innerHTML = baseDef;
    spAtkDisplay.innerHTML = "SP ATK: " + calcStat("spatk", baseSpAtk, 31, spAtkEVs, 50, spAtkNature);
    spAtkBaseDiv.innerHTML = baseSpAtk;
    spDefDisplay.innerHTML = "SP DEF: " + calcStat("spdef", baseSpDef, 31, spDefEVs, 50, spDefNature);
    spDefBaseDiv.innerHTML = baseSpDef;
    speDisplay.innerHTML = "SPE: " + calcStat("spe", baseSpe, 31, speEVs, 50, speNature);
    speBaseDiv.innerHTML = baseSpe;
}

function validateEVValues() {
    if (hpInput.value < 0 || hpInput.value > 252) {
        hpInput.value = Math.max(0, Math.min(252, hpInput.value));
    }
    if (atkInput.value < 0 || atkInput.value > 252) {
        atkInput.value = Math.max(0, Math.min(252, atkInput.value));
    }
    if (defInput.value < 0 || defInput.value > 252) {
        defInput.value = Math.max(0, Math.min(252, defInput.value));
    }
    if (spAtkInput.value < 0 || spAtkInput.value > 252) {
        spAtkInput.value = Math.max(0, Math.min(252, spAtkInput.value));
    }
    if (spDefInput.value < 0 || spDefInput.value > 252) {
        spDefInput.value = Math.max(0, Math.min(252, spDefInput.value));
    }
    if (speInput.value < 0 || speInput.value > 252) {
        speInput.value = Math.max(0, Math.min(252, speInput.value));
    }


    updateRemainingEVs();
    updateRemainingPoints();
}

function calcStat(statName, baseStat, iv, ev, level, natureModifier) {
    let statValue;

    if (statName === "hp") {
        statValue = Math.floor((((2 * baseStat) + iv + (ev / 4)) * level) / 100) + level + 10;
    } else {
        statValue = Math.floor((Math.floor((((2 * baseStat) + iv + (ev / 4)) * level) / 100) + 5) * natureModifier);
    }

    return statValue;
}

async function findPkmn(clickedSuggestion = false) {
    let pkmnName = document.getElementById("pkmn-search").value.toLowerCase();
    if (event.key === "Enter" || clickedSuggestion) {
        document.getElementById('suggestions').style.display = 'none';

        clearInputs();
        
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + pkmnName);
        if (!response.ok) return;

        document.getElementById("add-to-team").style.display = "block";
        
        let data = await response.json();
        // console.log(data);

        displayPkmnInfo(data);
    } else {
        
    }
}

function showSuggestions(input) {
    const suggestions = allPokemon.filter(name => 
        name.includes(input.toLowerCase()) && input.length > 2
    ).slice(0, 5); // Limit to 5 suggestions

    const suggestionBox = document.getElementById('suggestions');

    if (suggestions.length > 0) {
        suggestionBox.style.display = 'block';
        suggestionBox.innerHTML = '';
        
        suggestions.forEach(name => {
            const div = document.createElement('div');
            div.textContent = name;
            div.className = 'suggestion';
            div.onclick = () => {
                suggestionBox.style.display = 'none';
                document.getElementById('pkmn-search').value = name;
                findPkmn(true);
            };
            suggestionBox.appendChild(div);
        });
    } else {
        suggestionBox.style.display = 'none';
    }
}

function displayPkmnInfo(data) {
    currPkmnName = data.name;

    baseHP = data.stats[0].base_stat;
    baseAtk = data.stats[1].base_stat;
    baseDef = data.stats[2].base_stat;
    baseSpAtk = data.stats[3].base_stat;
    baseSpDef = data.stats[4].base_stat;
    baseSpe = data.stats[5].base_stat;

    document.getElementById("pkmn-name").innerHTML = currPkmnName.toUpperCase();

    // play the pokemon's cry
    let cryUrl = `https://play.pokemonshowdown.com/audio/cries/${currPkmnName.toLowerCase()}.mp3`;
    let audio = new Audio(cryUrl);
    audio.play().catch(error => {
        console.log("Could not play Pokemon cry:", error);
    });

    processStats();
}

function clearInputs() {
    hpInput.value = 0;
    atkInput.value = 0;
    defInput.value = 0;
    spAtkInput.value = 0;
    spDefInput.value = 0;
    speInput.value = 0;

    natureModifierButtons.forEach(button => {
        button.classList.remove("active");
    });

    atkNature = 1;
    defNature = 1;
    spAtkNature = 1;
    spDefNature = 1;
    speNature = 1;
}

function addPkmnToTeam(pkmn) {
    // console.log(pkmn);
    let teamDiv = document.getElementById("team");
    let pkmnDiv = document.createElement("div");
    pkmnDiv.className = "team-member " + pkmn.name;
    pkmnDiv.innerHTML = `
        <p class="pkmn-name team-member-stat">${pkmn.name.toUpperCase()}</p>
        <p class="pkmn-hp team-member-stat hp">HP:&nbsp;(${pkmn.stats.hp.ev})<br><span class="team-member-stat-value">${pkmn.stats.hp.value}</span></p>
        <p class="pkmn-atk team-member-stat atk">ATK:&nbsp;(${pkmn.stats.atk.ev}${pkmn.stats.atk.nature < 1 ? '-' : ''}${pkmn.stats.atk.nature > 1 ? '+' : ''})<br><span class="team-member-stat-value">${pkmn.stats.atk.value}</span></p>
        <p class="pkmn-def team-member-stat def">DEF:&nbsp;(${pkmn.stats.def.ev}${pkmn.stats.def.nature < 1 ? '-' : ''}${pkmn.stats.def.nature > 1 ? '+' : ''})<br><span class="team-member-stat-value">${pkmn.stats.def.value}</span></p>
        <p class="pkmn-spatk team-member-stat spatk">SP ATK:&nbsp;(${pkmn.stats.spatk.ev}${pkmn.stats.spatk.nature < 1 ? '-' : ''}${pkmn.stats.spatk.nature > 1 ? '+' : ''})<br><span class="team-member-stat-value">${pkmn.stats.spatk.value}</span></p>
        <p class="pkmn-spdef team-member-stat spdef">SP DEF:&nbsp;(${pkmn.stats.spdef.ev}${pkmn.stats.spdef.nature < 1 ? '-' : ''}${pkmn.stats.spdef.nature > 1 ? '+' : ''})<br><span class="team-member-stat-value">${pkmn.stats.spdef.value}</span></p>
        <p class="pkmn-spe team-member-stat spe">SPE:&nbsp;(${pkmn.stats.spe.ev}${pkmn.stats.spe.nature < 1 ? '-' : ''}${pkmn.stats.spe.nature > 1 ? '+' : ''})<br><span class="team-member-stat-value">${pkmn.stats.spe.value}</span></p>
        <div class="edit-pkmn"><button class="edit-pkmn-btn" onclick="editPkmn('${pkmn.name}')">Edit</button><button class="edit-pkmn-btn" onclick="removePkmnFromTeam('${pkmn.name}')">Remove</button></div>
    `;
    teamDiv.appendChild(pkmnDiv);
}

function editPkmn(pkmnName) {
    let team = JSON.parse(localStorage.getItem("team")) || [];
    let pkmn = team.find(pkmn => pkmn.name === pkmnName);
    if (pkmn) {
        // "search" for the pokemon
        document.getElementById("pkmn-search").value = pkmnName;

        findPkmn(true);

        // set the inputs to the pokemon's stats
        hpInput.value = pkmn.stats.hp.ev;
        atkInput.value = pkmn.stats.atk.ev;
        defInput.value = pkmn.stats.def.ev;
        spAtkInput.value = pkmn.stats.spatk.ev;
        spDefInput.value = pkmn.stats.spdef.ev;
        speInput.value = pkmn.stats.spe.ev;

        atkNature = pkmn.stats.atk.nature;
        defNature = pkmn.stats.def.nature;
        spAtkNature = pkmn.stats.spatk.nature;
        spDefNature = pkmn.stats.spdef.nature;
        speNature = pkmn.stats.spe.nature;

        // set the nature buttons accordingly
        natureModifierButtons.forEach(button => {
            let data = button.getAttribute("id").split("-");
            let stat = data[0];
            let modifier = data[2];
            if (stat === 'atk' && modifier === 'minus' && atkNature < 1) {
                button.classList.add("active");
            }
            else if (stat === 'atk' && modifier === 'plus' && atkNature > 1) {
                button.classList.add("active");
            }
            else if (stat === 'def' && modifier === 'minus' && defNature < 1) {
                button.classList.add("active");
            }
            else if (stat === 'def' && modifier === 'plus' && defNature > 1) {
                button.classList.add("active");
            }
            else if (stat === 'spatk' && modifier === 'minus' && spAtkNature < 1) {
                button.classList.add("active");
            }
            else if (stat === 'spatk' && modifier === 'plus' && spAtkNature > 1) {
                button.classList.add("active");
            }
            else if (stat === 'spdef' && modifier === 'minus' && spDefNature < 1) {
                button.classList.add("active");
            }
            else if (stat === 'spdef' && modifier === 'plus' && spDefNature > 1) {
                button.classList.add("active");
            }
            else if (stat === 'spe' && modifier === 'minus' && speNature < 1) {
                button.classList.add("active");
            }
            else if (stat === 'spe' && modifier === 'plus' && speNature > 1) {
                button.classList.add("active");
            }
        });

        processStats();
    }
}

function removePkmnFromTeam(pkmnName) {
    let team = JSON.parse(localStorage.getItem("team")) || [];
    team = team.filter(pkmn => pkmn.name !== pkmnName);
    localStorage.setItem("team", JSON.stringify(team));

    let pkmnDiv = document.querySelector(`.${pkmnName}`);
    pkmnDiv.remove();

    updateRemainingPoints();
}

function updateRemainingEVs() {
    let totalEVs = parseInt(hpInput.value) + parseInt(atkInput.value) + parseInt(defInput.value) + parseInt(spAtkInput.value) + parseInt(spDefInput.value) + parseInt(speInput.value);
    let remainingEVs = 508 - totalEVs;
    document.getElementById("remaining-evs-value").innerText = remainingEVs;
}

function updateRemainingPoints() {
    let totalPointsUsed = 0;
    let pointsSpans = document.querySelectorAll(".team-member-stat-value");
    pointsSpans.forEach(span => {
        if (!span.parentElement.classList.contains("hp") && !span.parentElement.classList.contains("spe")) {
            let valueCheck = parseInt(span.innerText) - 150 < 0 ? 0 : parseInt(span.innerText) - 150;
            totalPointsUsed += valueCheck;
        }
    });
    let remainingPoints = 120 - totalPointsUsed;
    document.getElementById("remaining-points-value").innerHTML = remainingPoints;
}








async function init() {
    hpInput = document.getElementById("hp-input");
    hpBaseDiv = document.getElementById("hp-base");
    hpDisplay = document.getElementById("hp-display");
    atkInput = document.getElementById("atk-input");
    atkBaseDiv = document.getElementById("atk-base");
    atkDisplay = document.getElementById("atk-display");
    defInput = document.getElementById("def-input");
    defBaseDiv = document.getElementById("def-base");
    defDisplay = document.getElementById("def-display");
    spAtkInput = document.getElementById("spatk-input");
    spAtkBaseDiv = document.getElementById("spatk-base");
    spAtkDisplay = document.getElementById("spatk-display");
    spDefInput = document.getElementById("spdef-input");
    spDefBaseDiv = document.getElementById("spdef-base");
    spDefDisplay = document.getElementById("spdef-display");
    speInput = document.getElementById("spe-input");
    speBaseDiv = document.getElementById("spe-base");
    speDisplay = document.getElementById("spe-display");

    hpInput.addEventListener("input", processStats);
    hpInput.value = 0;
    hpBaseDiv.innerHTML = baseHP;
    hpDisplay.innerHTML = "HP: " + calcStat("hp", baseHP, 31, 0, 50, 1);

    atkInput.addEventListener("input", processStats);
    atkInput.value = 0;
    atkBaseDiv.innerHTML = baseAtk;
    atkDisplay.innerHTML = "ATK: " + calcStat("atk", baseAtk, 31, 0, 50, atkNature);

    defInput.addEventListener("input", processStats);
    defInput.value = 0;
    defBaseDiv.innerHTML = baseDef;
    defDisplay.innerHTML = "DEF: " + calcStat("def", baseDef, 31, 0, 50, defNature);

    spAtkInput.addEventListener("input", processStats);
    spAtkInput.value = 0;
    spAtkBaseDiv.innerHTML = baseSpAtk;
    spAtkDisplay.innerHTML = "SP ATK: " + calcStat("spatk", baseSpAtk, 31, 0, 50, spAtkNature);

    spDefInput.addEventListener("input", processStats);
    spDefInput.value = 0;
    spDefBaseDiv.innerHTML = baseSpDef;
    spDefDisplay.innerHTML = "SP DEF: " + calcStat("spdef", baseSpDef, 31, 0, 50, spDefNature);

    speInput.addEventListener("input", processStats);
    speInput.value = 0;
    speBaseDiv.innerHTML = baseSpe;
    speDisplay.innerHTML = "SPE: " + calcStat("spe", baseSpe, 31, 0, 50, speNature);

    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
        if (!response.ok) return;
        const data = await response.json();
        allPokemon = data.results.map(p => p.name);
    } catch (error) {
        return;
    }

    // set up any previously saved team
    let team = JSON.parse(localStorage.getItem("team")) || [];
    team.forEach(pkmn => {
        addPkmnToTeam(pkmn);
    });

    updateRemainingPoints();
}