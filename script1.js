const characterFullInfo = document.getElementById("characterfullinfo");

//Функция для сбора информации о персонаже
const getCharacterFullInfo = async (character) =>
{
    characterFullInfo.innerHTML =
    `
        <div id="controllelement">
            <button id="homebutton">Home</button>
        </div>
        <div id="biography">
            <img src="${character.image}" alt="portrait">
            <p><b>Name: </b>${character.name}</p>
            <p><b>Origin: </b>${character.origin.name}</p>
            <p><b>Gender: </b>${character.gender}</p>
            <p><b>Species: </b>${character.species}</p>
            <p><b>Current status: </b>${character.status}</p>
        </div>
    `
    characterFullInfo.innerHTML +=
    `
        <div id="episodes">
            <p><u>Episodes:</u></p>
            <br>
        </div>
    `

    for(const episodeUrl of character.episode)
    {
        await fetch(episodeUrl).then(response => response.json()).then(episodeInfo => 
        {
            characterFullInfo.querySelector("#episodes").innerHTML +=
            `
                <div class="episode">
                    <p><b>Title: </b>${episodeInfo.name}</p>
                    <p><b>Episode: </b>${episodeInfo.episode}</p>
                    <p><b>Air date: </b>${episodeInfo.air_date}</p>
                </div>
            `
        });
    }
}

window.addEventListener("load", () => getCharacterFullInfo(JSON.parse(localStorage.getItem(localStorage.getItem("choosedCharacterId")))));
//Переход на главную страницу
characterFullInfo.addEventListener("click", (event) => 
{
    const button = event.target.closest("button");

    if(button !== null)
    {
        localStorage.removeItem("choosedCharacterId");
        window.location.replace("/index.html");
    }
});