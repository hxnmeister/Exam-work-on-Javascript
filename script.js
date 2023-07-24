//Ссылка на API который хранит информацию о персонажах
const charactersApiUrl = "https://rickandmortyapi.com/api/character";

const form = document.forms.searchform;
const searchText = form.searchtext;

const searchBar = document.getElementById("searchbar");
const charactersList = document.getElementById("characterslist");
const charactersContainer = document.getElementById("characters");

// localStorage.clear();

//Функция для добавления персонажей на страницу
const addCharcterOnPage = (character) =>
{
    charactersList.innerHTML += 
    `
        <div class="frame">
            <img src="${character.image}" alt="characterpicture">
            <p>${character.name}</p>
            <button id="${character.id}">Delete</button>
        </div>
    `
}
//Функция для проверки на повторения пресонажей которые уже были добавлены
const checkCharactersInList = (character) =>
{
    if(!localStorage.getItem(character.id))
    {
        localStorage.setItem(character.id, JSON.stringify(character));
        addCharcterOnPage(character);
    }
    else
    {
        alert(`Such character as ${character.name} already added!`);
    }
}
//Поиск и добавление персонажа в список
form.addEventListener("submit", async (event) => 
{
    event.preventDefault();

    try
    {
        //Проверка поля поиска на пустоту
        if(searchText.value !== "")
        {
            //Отправляем запрос к API в случае негативного ответа возвращаем ошибку
            const requestResult = await fetch(`${charactersApiUrl}/${searchText.value}`).then(async result => 
            {
                return result.ok ? result.json() : result.json().then(errorMessge => { throw new Error(errorMessge.error) });
            });

            //Обработка при получении всего одного объекта
            if(requestResult.length == undefined) checkCharactersInList(requestResult);
            //Обработка множества объектов
            else requestResult.map(item => checkCharactersInList(item));
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
//Удаление персонажа
charactersList.addEventListener("click", event => 
{
    const deleteButton = event.target.closest("button");

    if(deleteButton !== null)
    {
        if(confirm(`Confirm character ${JSON.parse(localStorage.getItem(deleteButton.id)).name} deletion?`))
        {
            localStorage.removeItem(deleteButton.id);

            charactersList.innerHTML = "";
            //Обновление списка персонажей после удаления
            for(let i = 0; i < localStorage.length; i++)
            {
                const key = localStorage.key(i);
                const character = JSON.parse(localStorage.getItem(key));

                addCharcterOnPage(character);
            }
        }
    }
});
//Выбор персонажа для отображения полной информации о нем
charactersList.addEventListener("click", async event => 
{
    const choosedCharacter = event.target.closest("img");
    
    if(choosedCharacter !== null)
    {
        //Получаем id отображаемого персонажа
        const choosedCharacterId = choosedCharacter.parentNode.getElementsByTagName("button")[0].id;
        localStorage.setItem("choosedCharacterId", choosedCharacterId);

        window.location.replace("/index1.html");
    }
})
//Загрузка ранее выбранных персонажей
window.addEventListener("load", () => 
{
    if(charactersList.innerHTML === "" && localStorage.length > 0)
        {
            for(let i = 0; i < localStorage.length; i++)
            {
                const key = localStorage.key(i);
                const character = JSON.parse(localStorage.getItem(key));

                if(key !== "choosedCharacterId") addCharcterOnPage(character);
            }
        }
});