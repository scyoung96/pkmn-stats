let setInput = document.getElementById("showdown-set");

setInput.addEventListener("input", async function() {
    let input = setInput.value;

    await convertShowdownSet(input);
});

async function convertShowdownSet(showdownSet) {
    let lines = showdownSet.split("\n");
    let pkmn = {};

    for (let i = 0; i < lines.length; i++) {
        switch (i) {
            case 0:
                if (!lines[i].includes("@")) {
                    pkmn.name = lines[i].trim();
                    pkmn.item = "";
                    break;
                }
                pkmn.name = lines[i].split(" @ ")[0].trim();
                pkmn.item = lines[i].split(" @ ")[1].trim();
                break;
            case 1:
                pkmn.ability = lines[i].split(": ")[1].trim();
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                let evs = lines[i].split(": ")[1].split(" / ");
                for (let ev of evs) {
                    let [value, stat] = ev.split(" ");
                    pkmn[stat.toLowerCase()] = parseInt(value);
                }
                break;
            case 5:
                pkmn.nature = lines[i].split(" ")[0].trim();
                break;
            default:
                if (lines[i].startsWith("- ")) {
                    let move = lines[i].substring(2).trim();
                    if (!pkmn.moves) {
                        pkmn.moves = [];
                    }
                    pkmn.moves.push(move);
                }
                break;
        }
    }

    // get pokemon types from api
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pkmn.name.toLowerCase()}`)
        .then(response => response.json())
        .then(data => {
            pkmn.types = data.types.map(typeInfo => typeInfo.type.name);
            pkmn.types = pkmn.types.map(type => type.charAt(0).toUpperCase() + type.slice(1));
        })
        .catch(error => {
            console.error("Error fetching Pokémon types:", error);
        });


    // Convert to CSV
    // let csvTemplate = `Name,Type 1,Type 2,Ability,Item,Nature,HP,Atk,Def,Sp. Atk,Sp. Def,Spe,Move 1,Move 2 ,Move 3,Move 4`
    let csvData = `${pkmn.name},${pkmn.types[0]},${pkmn.types[1] ? pkmn.types[1] : ''},${pkmn.ability},${pkmn.item},${pkmn.nature},${pkmn.hp || ''},${pkmn.atk || ''},${pkmn.def || ''},${pkmn.spa || ''},${pkmn.spd || ''},${pkmn.spe || ''},${pkmn.moves ? pkmn.moves[0] || '' : ''},${pkmn.moves ? pkmn.moves[1] || '' : ''},${pkmn.moves ? pkmn.moves[2] || '' : ''},${pkmn.moves ? pkmn.moves[3] || '' : ''}`;

    // copy csvData to clipboard
    navigator.clipboard.writeText(csvData).then(() => {
        setInput.value = "Set copied to clipboard!";
        setTimeout(() => {
            setInput.value = "";
        }, 1000);
    }).catch(err => {
        alert("Failed to copy CSV data to clipboard. Make sure you did not set the gender of the Pokémon in the Showdown set.");
    });
}
