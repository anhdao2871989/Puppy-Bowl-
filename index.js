const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const imgContainer = newPlayerFormContainer.querySelector("img");
const playerName = document.getElementById("name");
const playerBreed = document.getElementById("breed");
const playerStatus = document.getElementById("status");
const playerTeamId = document.getElementById("teamId");
const playerCohorId = document.getElementById("cohortId");
const allPlayers = document.getElementById("all-players-container");


const cohortName = '2308-FTB-MT-WEB-PT';

const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

function setImgSrcAndAlt (imgEL, imgSrc, imgAlt){
    imgEL.src = imgSrc;
    imgEL.alt = imgAlt;
}

function createBasicInfoUI(players){
    playerName.innerText = `Name: ${players.name}`;
    playerBreed.innerText = `Breed: ${players.breed}`;
    playerStatus.innerText = `Status: ${players.status}`;
    playerTeamId.innerText = `TeamID: ${players.teamId}`;
    playerCohorId.innerText = `CohortID: ${players.cohortId}`;
}

function createPlayersUI(playersArr) {
    let playersString ="";
    playersArr.forEach(
      (players) => (playersString += `<li> ${data.players}</li>`)
    );
    allPlayers.innerText = playersString;
}

function createBasicPuppyProfile(players){
    setImgSrcAndAlt(
        imgContainer,
        players.imageUrl,
        players.name
    );
    createBasicInfoUI(players);

}

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${API_URL}`);
        const players = await response.json();
        console.log(players.data.players);
        
        return players.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

fetchAllPlayers();


const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${API_URL}/${playerId}`);
        const player = await response.json(); 
        return player;
    } catch (error) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

async function renderPlayerDetails(playerId) {
    try {
        const playerDetails = await fetchSinglePlayer(playerId);
        renderSinglePartyById(playerDetails);
        console.log(player);
        } catch {
            console.error(error);
        }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(`${API_URL}`,
        {
            method: 'POST',
            body: JSON.stringify(playerObj)({
                name:'Rufus',
                breed:'Irish Setter',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            
            }),    
        });
        console.log(res);
        const json = await response.json();
        console.log(json);
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${API_URL}/${playerId}`, {
            method: "DELETE"
        })

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

const renderAllPlayers = async (playerList) => {
    try {
        playerContainer.innerHTML = "";
        playerList.forEach(player => {
            const playerElement = document.createElement("div");
            playerElement.classList.add("player-card");
            playerElement.innerHTML = /*html*/
                `
            <div class="dog">
            <h1>${player.name} is a ${player.breed}</h1>
            <img src="${player.imageUrl}" alt="${player.name} looks like a ${player.breed}"/>

            <button class="delete-button" data-id=${player.id} >Delete Player!</button>
            <button class="details-button" data-id=${player.id} >See Player Info!</button>
            </div>
            `;
            playerContainer.appendChild(playerElement);
            let deleteButton = playerElement.querySelector(".delete-button");
            deleteButton.addEventListener("click", async (e) => {
                e.preventDefault();
                console.log("This doggo is going to be deleted");
                await removePlayer(player.id);
                const players = await fetchAllPlayers();
                renderAllPlayers(players);
            });
            let detailButton = playerElement.querySelector(".details-button");
            detailButton.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("I will show more doggo details");
                renderSinglePlayer(player)
            });
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderSinglePlayer = async (player) =>{
    if(!player || player.length === 0)
    {
        playerContainer.innerHTML =
        `
        <h1>There is not a doggo here! 🧐</h1>
        `;
        return
    }
    let singlePlayerHTML = 
    `
    <div class="single-player-div">
        <div class="single-player-info">
            <img src = "${player.imageUrl}" alt = "${player.name}" />
            <h2>
            This pupper is named ${player.name}.
            </h2>
            <h2>
            This puppy is a ${player.breed}, wow!
            </h2>
            <h2>
            They are currently on the ${player.status}.
            </h2>
            <h2>They play for team ${player.teamId}! <h2>
            <h2>Their player id is: ${player.id}.</h2>
        </div>
        <button class= "back-button">Go back!</button>
    </div>
    `;
    playerContainer.innerHTML = singlePlayerHTML;
    let backButton = playerContainer.querySelector(".back-button");
    backButton.addEventListener("click", async () =>{
        const players = await fetchAllPlayers();
        renderAllPlayers(players)
    });
}


const renderNewPlayerForm = () => {
    try {let fromHTML = 
    `<form>
    <h1>Add Your favorite pup to the team!</h1>
    <label for="name">Name</label>
    <input type="text" id="name" name="name" />

    <label for="breed">Breed</label>
    <input type="text" id="breed" name="breed" />

    <label for="status">Status</label>
    <input type="text" id="status" name="status" />
<br>

    <label for="image">Picture</label>
    <input type="text" id="image" name="image" />

    <button type="submit">Submit</button> 
    </form>`;
    newPlayerFormContainer.innerHTML = fromHTML;

    let form = newPlayerFormContainer.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        let playerData = {
            name: form.name.value,
            breed: form.breed.value,
            status: form.status.value,
            imageUrl: form.image.value,
        };
        console.log(playerData);

        await addNewPlayer(
            playerData
        );
        
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
        playerData.name.valueOf = '';
        playerData.breed.valueOf = '';
        playerData.status.valueOf = '';
        playerData.image.valueOf = '';
    });
        
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();