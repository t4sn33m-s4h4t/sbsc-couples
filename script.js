const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = clonedArray[i]

        clonedArray[i] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}



const generateGame = () => {


    let emojis = '[{"key": 2, "name": "hamid.jpg"}, {"key": 2, "name": "rutobah.jpg"}, {"key": 1, "name": "lazim.jpg"}, {"key": 1, "name": "tamima.jpg"}, {"key": 6, "name": "zubayer.jpg"}, {"key": 6, "name": "mehrin.jpg"}, {"key": 8, "name": "shuvro.jpg"}, {"key": 8, "name": "maria.jpg"}, {"key": 25, "name": "zihad.jpg"}, {"key": 25, "name": "munia.jpg"}, {"key": 22, "name": "tasneem.jpg"}, {"key": 22, "name": "mahjabin.jpg"}  ]'
    emojis = JSON.parse(emojis)
    const items = shuffle([...emojis])
    const boardDiv = document.createElement('div');
    boardDiv.classList.add('board');

    items.forEach(item => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        const frontDiv = document.createElement('div');
        frontDiv.classList.add('card-front');
        cardDiv.appendChild(frontDiv);

        const backDiv = document.createElement('div');
        backDiv.classList.add('card-back');
        backDiv.setAttribute('MatchSymbol', item.key);
        backDiv.style.background = `#FDF8E6 url('./images/${item.name}') no-repeat center center fixed`;
        backDiv.style.backgroundSize = 'cover';
        cardDiv.appendChild(backDiv);

        boardDiv.appendChild(cardDiv);
    });

    const cards = boardDiv.outerHTML;

    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `Time: ${state.totalTime} sec`
    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
        firstcard = flippedCards[0].querySelector('.card-back').getAttribute('MatchSymbol')
        secondcard = flippedCards[1].querySelector('.card-back').getAttribute('MatchSymbol')
        console.log(firstcard, secondcard)
        if (firstcard === secondcard) {
            ``
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 500)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        selectors.win.style.display = 'block'
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}
window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    setTimeout(function () {
        loader.style.display = "none";
    }, 1000);
});
generateGame()
attachEventListeners()