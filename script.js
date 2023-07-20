let characters = [];

const form = document.forms.search;
const searchText = form.searchtext;
const charactersList = document.getElementById("characterslist");
const charactersApiUrl = "https://rickandmortyapi.com/api/character";

const checkCharactersInList = (character) =>
{
    if(!characters.find(item => item.id == character.id))
    {
        characters.push(character);
        charactersList.innerHTML += 
        `
            <div class="frame">
                <img src="${character.image}" alt="characterpicture">
                <p>${character.name}</p>
                <button id="${character.id}">Delete</button>
            </div>
        `
    }
    else
    {
        alert(`Such character as ${character.name} already added!`);
    }
}

form.addEventListener("submit", async (event) => 
{
    event.preventDefault();

    try
    {
        const requestResult = await fetch(`${charactersApiUrl}/${searchText.value}`).then(async result => 
            {
                return result.ok ? result.json() : result.json().then(errorMessge => { throw new Error(errorMessge.error) });
            });
        
            if(searchText.value !== "")
            {
                if(requestResult.length == undefined)
                {
                    checkCharactersInList(requestResult);
                    // const currentCharacters = charactersList.querySelectorAll("button");
                    // currentCharacters.forEach(button => 
                    // {
                    //     if(button.id === String(requestResult.id))
                    //     {
                    //         button.addEventListener("click", (event) => alert(event.currentTarget.id));
                    //     }
                    // });
                }
                else
                {
                    requestResult.map(item => checkCharactersInList(item));
                }
            }
            else
            {
                throw new Error("Search field was empty!");
            }
        }
    catch(e)
    {
        alert(e.message);
    }
});
charactersList.addEventListener("click", event => 
{
    const deleteButton = event.target.closest("button");

    if(deleteButton !== null)
    {
        const position = characters.findIndex(item => String(item.id) === deleteButton.id);
    
        if(confirm(`Confirm character ${characters[position].name} deletion?`))
        {
            characters.splice(position, 1);
    
            charactersList.innerHTML = "";
            characters.map(character => charactersList.innerHTML += 
            `
                <div class="frame">
                    <img src="${character.image}" alt="characterpicture">
                    <p>${character.name}</p>
                    <button id="${character.id}">Delete</button>
                </div>
            `);
        }
    }
});
charactersList.addEventListener("click", async event => 
{
    const choosedCharacter = event.target.closest("img");
    
    if(choosedCharacter !== null)
    {
        const choosedCharacterId = choosedCharacter.parentNode.getElementsByTagName("button")[0].id;
        const position = characters.findIndex(item => String(item.id) === choosedCharacterId);
        let characterInfo = 
        `
            <div id="characterinfocontainer">
                <img src="${characters[position].image}" alt="portrait">
                <p id="chrname">Name: <b>${characters[position].name}</b></p>
                <p><u>Episodes: </u></p>
        `;

        for (const episodeUrl of characters[position].episode) 
        {
            await fetch(episodeUrl).then(response => response.json()).then(result => characterInfo += 
                `
                    <div class="episode"> 
                    <p><b>Name: </b>${result.name}</p>
                    <p><b>Episode: </b>${result.episode}</p>
                    <p><b>Air date: </b>${result.air_date}</p>
                    </div>
                `);
        }

        characterInfo += "</div>";

        charactersList.innerHTML = characterInfo;
    }
})