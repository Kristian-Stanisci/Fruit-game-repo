
//Jeg kommenterer ut slik at jeg kan gå tilbake å huske koden min - Kristian
document.addEventListener('DOMContentLoaded', function() { //Sjekker om siden er ferdig lastet inn
    let inputModal = document.getElementById("inputModal"); 
    let closeButton = document.getElementsByClassName("close")[0]; 
    let openModalButton = document.getElementById("openInputModal");
    console.log(openModalButton);

    openModalButton.onclick = openModal;
    console.log("Modal:", inputModal);
    console.log("Close button:", closeButton);
    console.log("Open modal button:", openModalButton);

    function openModal() {
            inputModal.style.display = "block";
            console.log("Modal opened"); 
    }

    closeButton.onclick = function() {
        inputModal.style.display = "none";
    }

    window.onclick = function(event) { 
        if (event.target == inputModal) {
            inputModal.style.display = "none";
        }
    }

    document.getElementById("submitBtn").onclick = function() {
        let userInput = document.getElementById("userInput").value;
        console.log("User selected: " + userInput);
        inputModal.style.display = "none";
        setDifficulty(userInput);
    }

    let Poeng = 0;
    let createdEmojis = 0;
    const totalItems = 30;
    const poengTeller = document.getElementById("poengTeller");
    const gameContainer = document.getElementById("game-container");
    const basket = document.getElementById("Kurv");

    let KurvPosition = gameContainer.offsetWidth / 2 - basket.offsetWidth / 2; //Setter kurven i midten
    basket.style.left = `${KurvPosition}px`;

    var gameRunning = false; //Sjekker om spillet kjører
    let fallingSpeed = 3;


    function setDifficulty(difficulty) {
        if (difficulty === "Easy") {
            fallingSpeed = 2;
        } else if (difficulty === "Medium") {
            fallingSpeed = 4;
        } else if (difficulty === "Hard") {
            fallingSpeed = 6;
        } else {
            fallingSpeed = 3;
        }
        console.log("Falling speed set to: " + fallingSpeed);
    }

    const step = 16;
    let moveLeft = false;
    let moveRight = false;
    let moveLeft2 = false;
    let moveRight2 = false;

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft" || event.key === "a") {
            moveLeft = true;
        } else if (event.key === "ArrowRight" || event.key === "d") {
            moveRight = true;
        }
    });
    
    document.addEventListener("keyup", function(event) { //Sjekker når knappen blir sluppet
        if (event.key === "ArrowLeft" || event.key === "a") {
            moveLeft = false;
        } else if (event.key === "ArrowRight" || event.key === "d") {
            moveRight = false;
        }
    
    });

    function moveBasket() {
        if (moveLeft) {
            KurvPosition = Math.max(0, KurvPosition - step); 
            basket.style.left = `${KurvPosition}px`;
        }
        if (moveRight) {
            KurvPosition = Math.min(gameContainer.offsetWidth - basket.offsetWidth, KurvPosition + step);
            basket.style.left = `${KurvPosition}px`;
        }
        requestAnimationFrame(moveBasket); //Den gjør at det blir smooth å beveg kurva
    }
    
    moveBasket();

    let interval;
    let checkGameLost;
    let gameOverDisplayed = false;

    function endGame(won) {
        if (gameOverDisplayed) return;
        gameOverDisplayed = true;
        gameRunning = false;

        const message = document.createElement("div");
        message.id = "game-message";
        message.textContent = won ? "You won! 🎉🎉🎉" : "Game Over😒!";
        document.body.appendChild(message);

        clearInterval(interval);
        clearInterval(checkGameLost);
    }

    function StartGame() {
        gameRunning = true;
        gameOverDisplayed = false;
        createdEmojis = 0;
        Poeng = 0;
        poengTeller.textContent = `Poeng: ${Poeng}`;

        
        document.querySelectorAll('.emoji').forEach(emoji => emoji.remove());

        interval = setInterval(() => { 
            if (createdEmojis >= totalItems) {
                console.log("Stopping emoji creation: Limit reached");
                clearInterval(interval);
                return;
            }
            createEmoji();
        }, 1800); //Den her fortelle kor ofte emojian ska fall ned, i millisekunder

        checkGameLost = setInterval(() => {
            if (!gameRunning) return;

            const emojis = document.querySelectorAll('.emoji');
            emojis.forEach(emoji => {
                const emojiRect = emoji.getBoundingClientRect();
                if (emojiRect.top > window.innerHeight) {
                    endGame(false);
                }
            });
        }, 100);
    }

    function createEmoji() {
        if (createdEmojis >= totalItems) {
            console.log("All emojis created");
            return;
        }

        createdEmojis += 1;
        console.log(`Emoji created: Total = ${createdEmojis}`);

        const emojis = ["🍎", "🍇", "🍌"];

        const emoji = document.createElement("div");
        emoji.classList.add("emoji");
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.position = "absolute"; 
        emoji.style.top = "0px"; 
        emoji.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
        document.body.appendChild(emoji);

        let position = 0;
        let falling = setInterval(() => {
            if (position >= window.innerHeight) {
                emoji.remove();
                clearInterval(falling);
                return;
            }
            position += fallingSpeed;
            emoji.style.top = `${position}px`;

            const emojiRect = emoji.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();

            if (
                emojiRect.bottom >= basketRect.top &&
                emojiRect.top <= basketRect.bottom &&
                emojiRect.left <= basketRect.right &&
                emojiRect.right >= basketRect.left
            ) {
                emoji.remove();
                clearInterval(falling);
                Poeng += 1;
                poengTeller.textContent = `Poeng: ${Poeng}`;

                basket.classList.add('shake');
                setTimeout(() => {
                    basket.classList.remove('shake');
                }, 500);

                if (Poeng === totalItems) {
                    endGame(true);
                }
            }

            // Øker farten hver 5 emoji, % (modulo) er resten av en divisjon
            if (Poeng > 0 && Poeng % 5 === 0 && !emoji.classList.contains(`speed-increased-${Poeng}`)) {
                fallingSpeed += 1;
                emoji.classList.add(`speed-increased-${Poeng}`);
                console.log("Speed increased to: " + fallingSpeed);
            }
        }, 30);
    }
    
    document.getElementById("StartGame").addEventListener("click", function() { 
        this.disabled = true;
        this.style.display = "none";
        StartGame();
    });
});

//Evt legge til en highscore funksjon? - som lagres i local storage?