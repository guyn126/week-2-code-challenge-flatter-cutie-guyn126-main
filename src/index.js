// Your code here
// DOM fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const characterBar = document.getElementById("character-bar");
  const characterName = document.getElementById("name");
  const characterImage = document.getElementById("image");
  const voteCount = document.getElementById("vote-count");
  const votesForm = document.getElementById("votes-form");
  const resetBtn = document.getElementById("reset-btn");

  // To keep character selected
  let currentCharacter = null;

  // Function to show names of the characters in the top bar
  function renderCharacterNames(characters) {
    characterBar.innerHTML = "";
    characters.forEach((character) => {
      const span = document.createElement("span");
      span.textContent = character.name;
      span.addEventListener("click", () => showCharacterDetails(character));
      characterBar.appendChild(span);
    });
  }

  // Function to show details of the character
  function showCharacterDetails(character) {
    currentCharacter = character;
    characterName.textContent = character.name;
    characterImage.src = character.image;
    voteCount.textContent = character.votes;
  }

   // Function to add new character
  const characterForm = document.getElementById("character-form");

  characterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    
    const name = document.getElementById("new-name").value; 
    const imageUrl = document.getElementById("image-url").value;

    // Create new character
    const newCharacter = {
      name: name,
      image: imageUrl,
      votes: 0,
    };


    // Send request POST to add new character
    fetch("http://localhost:3000/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCharacter),
    })
      .then((response) => response.json())
      .then((addedCharacter) => {
        const span = document.createElement("span");
        span.textContent = addedCharacter.name;
        span.addEventListener("click", () =>
          showCharacterDetails(addedCharacter)
        );
        characterBar.prepend(span); 
        showCharacterDetails(addedCharacter); 
        characterForm.reset();
      });
  });

  // Function to Add votes
  votesForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const votesToAdd = parseInt(document.getElementById("votes").value, 10);
    if (!isNaN(votesToAdd)) {
      currentCharacter.votes += votesToAdd;
      updateCharacter(currentCharacter);
    }
    votesForm.reset();
  });

  // Function to reset the votes
  resetBtn.addEventListener("click", function () {
    currentCharacter.votes = 0;
    updateCharacter(currentCharacter);
  });


  // Function to update new character
  function updateCharacter(character) {
    fetch(`http://localhost:3000/characters/${character.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ votes: character.votes }),
    })
      .then((response) => response.json())
      .then((updatedCharacter) => {
        showCharacterDetails(updatedCharacter);
      });
  }

  // Reload form
  fetch("http://localhost:3000/characters")
    .then((response) => response.json())
    .then((characters) => {
      renderCharacterNames(characters);
      showCharacterDetails(characters[0]);
    });
});
