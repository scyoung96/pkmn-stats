let pkmnNameEl = document.getElementById('pkmn-name');
let triviaFactEl = document.getElementById('trivia-fact');

let pkmnList;
initializePkmnList().then((data) => {
    pkmnList = data;
    console.log(pkmnList);
});

async function initializePkmnList() {
    let data = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000')
        .then(response => response.json())
        .then(data => data.results.map(pkmn => pkmn.name));

    return data;
}

function getRandomFact() {
    let randomPkmn = pkmnList[Math.floor(Math.random() * pkmnList.length)];
    console.log(`Fetching trivia for: ${randomPkmn}`);
    pkmnNameEl.textContent = randomPkmn.charAt(0).toUpperCase() + randomPkmn.slice(1);

    let page = fetch(`https://bulbapedia.bulbagarden.net/wiki/${randomPkmn}_(Pok%C3%A9mon)`) // FIXME: manually typing a pkmn name in place of the formatted string works for some reason...
        .then(response => response.text())
        .then(html => {
            let triviaSection = html.match(/<span class="mw-headline" id="Trivia">Trivia<\/span>([\s\S]*?)<\/ul>/);
            if (triviaSection) {
                let triviaList = triviaSection[1].match(/<li>(.*?)<\/li>/g);
                if (triviaList && triviaList.length > 0) {
                    let randomIndex = Math.floor(Math.random() * triviaList.length);
                    let factText = triviaList[randomIndex].replace(/<[^>]*>/g, '').trim();
                    console.log(factText);
                    triviaFactEl.textContent = factText;
                    return factText;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}