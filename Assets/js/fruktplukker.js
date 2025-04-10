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
    const totalItems = 40;
    const poengTeller = document.getElementById("poengTeller");
    const boostIgjen = document.getElementById("boostIgjen");
    const gameContainer = document.getElementById("game-container");
    const basket = document.getElementById("Kurv");

    let highscore = localStorage.getItem("highScore") || 0;
    document.getElementById("highScore").textContent = `Highscore: ${highscore}`;

    let KurvPosition = gameContainer.offsetWidth / 2 - basket.offsetWidth / 2; //Setter kurven i midten
    basket.style.left = `${KurvPosition}px`;

    var gameRunning = false; //Sjekker om spillet kjører
    let fallingSpeed = 4;


    function setDifficulty(difficulty) {
        if (difficulty === "Easy") {
            fallingSpeed = 4;
        } else if (difficulty === "Medium") {
            fallingSpeed = 7;
        } else if (difficulty === "Hard") {
            fallingSpeed = 10.5;
        } else {
            fallingSpeed = 4;
        }
        console.log("Falling speed set to: " + fallingSpeed);
    }

    const step = 15;
    let moveLeft = false;
    let moveRight = false;
    let boost = false;
    const boostStep = 25;
    const boostDuration = 1000;
    let boosts = 0;
    const maxBoosts = 5;

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft" || event.key === "a") {
            moveLeft = true;
        } else if (event.key === "ArrowRight" || event.key === "d") {
            moveRight = true;
        } else if (event.key === " " && boosts > 0) {
            
            boost = true;
            boosts -= 1; 
            boostIgjen.textContent = `Boosts: ${boosts}`;
            setTimeout(() => {
                boost = false; 
            }, boostDuration);
            if (boosts === 0) {
                console.log("No more boosts left");
            }
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
            KurvPosition = Math.max(0, KurvPosition - (boost ? boostStep:step)); 
            basket.style.left = `${KurvPosition}px`;
        }
        if (moveRight) {
            KurvPosition = Math.min(gameContainer.offsetWidth - basket.offsetWidth, KurvPosition + (boost ? boostStep:step));
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
        message.innerHTML = won ? "You won! 🎉🎉🎉<br><button id='resetButton'>Play Again</button>" : "Game Over😒!<br><button id='resetButton'>Play Again</button>";
        
        document.body.appendChild(message);

        document.getElementById("resetButton").onclick = function() {
            document.body.removeChild(message);
            document.getElementById("StartGame").disabled = false;
            document.getElementById("StartGame").style.display = "block";
            location.reload(); 
        };

        clearInterval(interval);
        clearInterval(checkGameLost);
    }

    function StartGame() {
        gameRunning = true;
        gameOverDisplayed = false;
        createdEmojis = 0;
        Poeng = 0;
        poengTeller.textContent = `Poeng: ${Poeng}`;
        boosts = maxBoosts;
        boostIgjen.textContent = `Boosts: ${boosts}`;

        document.querySelectorAll('.emoji').forEach(emoji => emoji.remove());

        interval = setInterval(() => { 
            if (createdEmojis >= totalItems) {
                console.log("Stopping emoji creation: Limit reached");
                clearInterval(interval);
                return;
            }
            createEmoji();
        }, 1800);

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
            let velocityX = Math.sin(position/40)*10; //Posisjonen øker med 3 pga av fallingspeed, og dersom sinus blir positiv vil den gå mot høyre og negativ mot venstre, derfor blir det en bølge-aktig bevegelse. 
            emoji.style.left = `${Math.min(Math.max(0, parseFloat(emoji.style.left) + velocityX), gameContainer.offsetWidth - emoji.offsetWidth)}px`;
          

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

                let highscore = localStorage.getItem("highScore") || 0;
                if (Poeng > highscore) {
                    localStorage.setItem("highScore", Poeng);
                    highscore = Poeng;
                }
                console.log("Highscore: " + highscore);
                document.getElementById("highScore").textContent = `Highscore: ${highscore}`;
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
            console.log("Game started");
         });

         //Make the game become touch sensitive for mobile phones, to play on phones also to move the basket u just drag on the screen
        gameContainer.addEventListener("touchstart", function(event) {
            const touch = event.touches[0];
            if (touch.clientX < window.innerWidth / 2) {
                moveLeft = true;
            } else {
                moveRight = true;
            }
        });
        gameContainer.addEventListener("touchmove", function(event) {
            const touch = event.touches[0];
            if (touch.clientX < window.innerWidth / 2) {
                moveLeft = true;
                moveRight = false;
            } else {
                moveRight = true;
                moveLeft = false;
            }
        });
        gameContainer.addEventListener("touchend", function(event) {
            moveLeft = false;
            moveRight = false;
        });
        gameContainer.addEventListener("touchcancel", function(event) {
            moveLeft = false;
            moveRight = false;
        });
        gameContainer.addEventListener("touchleave", function(event) {
            moveLeft = false;
            moveRight = false;
        });
});

Date().toString()
//Evt legge til en highscore funksjon? - som lagres i local storage?