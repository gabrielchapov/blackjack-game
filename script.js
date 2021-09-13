// Scores
let blackjackGame = {
    "you": { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    "dealer": { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    "cards": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
    "cardsMap": { "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "K": 10, "J": 10, "Q": 10, "A": [1, 11] },
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "isStand": false,
    "turnsOver": false,

};

// Score objects
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

// Sounds
const hitSound = new Audio( './sounds/swish.m4a' );
const winSound = new Audio( './sounds/cash.mp3' );
const lossSound = new Audio( './sounds/aww.mp3' );

// Button queries
document.querySelector( '#blackjack-hit-button' ).addEventListener( 'click', blackjackHit );
document.querySelector( '#blackjack-stand-button' ).addEventListener( 'click', dealerLogic );
document.querySelector( '#blackjack-deal-button' ).addEventListener( 'click', blackjackDeal );

// Hit Function
function blackjackHit() {

    if ( blackjackGame['isStand'] === false ) {
        let card = randomCard();
        showCard( card, YOU );
        updateScore( card, YOU );
        showScore( YOU );
    }
}


function randomCard() {
    let randomIndex = Math.floor( Math.random() * 13 );
    return blackjackGame['cards'][randomIndex];
}

function showCard( card, activePlayer ) {
    if ( activePlayer['score'] <= 21 ) {
        let cardImage = document.createElement( 'img' );
        cardImage.src = `./images/${card}.png`;
        document.querySelector( activePlayer['div'] ).appendChild( cardImage );
        hitSound.play();
    }
}

// Deal Function
function blackjackDeal() {

    if ( blackjackGame['turnsOver'] === true ) {

        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector( '#your-box' ).querySelectorAll( 'img' );
        let dealerImages = document.querySelector( '#dealer-box' ).querySelectorAll( 'img' );

        for ( i = 0; i < yourImages.length; i++ ) {
            yourImages[i].remove();
        }
        for ( i = 0; i < dealerImages.length; i++ ) {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector( '#your-blackjack-result' ).textContent = 0;
        document.querySelector( '#dealer-blackjack-result' ).textContent = 0;

        document.querySelector( '#your-blackjack-result' ).style.color = '#fff';
        document.querySelector( '#dealer-blackjack-result' ).style.color = '#fff';

        document.querySelector( '#blackjack-result' ).textContent = 'Lets play';
        document.querySelector( '#blackjack-result' ).style.color = 'black';

        blackjackGame['turnsOver'] = true;
    }

};

// Update Score Function
function updateScore( card, activePlayer ) {
    // If adding 11 keeps me below 21, add 11. Otherwise add 1
    if ( card === 'A' ) {
        if ( activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21 ) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {

        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

// BUST or Win
function showScore( activePlayer ) {
    if ( activePlayer['score'] > 21 ) {
        document.querySelector( activePlayer['scoreSpan'] ).textContent = 'BUST!';
        document.querySelector( activePlayer['scoreSpan'] ).style.color = 'red';
    } else {
        document.querySelector( activePlayer['scoreSpan'] ).textContent = activePlayer['score'];
        document.querySelector( activePlayer['scoreSpan'] ).style.color = 'white';
    }

}

// Async bot function
function sleep( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
}

// Dealer Stand
async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while ( DEALER['score'] < 16 && blackjackGame['isStand'] === true ) {

        let card = randomCard();
        showCard( card, DEALER );
        updateScore( card, DEALER );
        showScore( DEALER );
        await sleep( 1000 );
    }


    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult( winner );

}



// Compute winner and return winner
// update the wins, loss and draws
function computeWinner() {
    let winner;

    if ( YOU['score'] <= 21 ) {
        // Condition-, higher score than dealer or when dealer busts but you are 21
        if ( YOU['score'] > DEALER['score'] || ( DEALER['score'] > 21 ) ) {
            blackjackGame['wins']++;
            winner = YOU;

        } else if ( YOU['score'] < DEALER['score'] ) {
            blackjackGame['losses']++;
            winner = DEALER;

        } else if ( YOU['score'] === DEALER['score'] ) {
            blackjackGame['draws']++;
        }
        // condition, when user busts but dealer doesnt
    } else if ( YOU['score'] > 21 && DEALER['score'] <= 21 ) {
        blackjackGame['losses']++;
        winner = DEALER;

        // condition: when you AND the dealer busts
    } else if ( YOU['score'] > 21 && DEALER['score'] > 21 ) {
        blackjackGame['draws']++;
    }

    console.log( blackjackGame );
    return winner;
}

function showResult( winner ) {
    let message, messageColor;

    if ( blackjackGame['turnsOver'] === true ) {



        if ( winner === YOU ) {
            document.querySelector( '#wins' ).textContent = blackjackGame['wins'];
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
        } else if ( winner === DEALER ) {
            document.querySelector( '#losses' ).textContent = blackjackGame['losses'];
            message = 'You Lost!';
            messageColor = 'red';
            lossSound.play();
        } else {
            document.querySelector( '#draws' ).textContent = blackjackGame['draws'];
            message = 'You Drew!';
            messageColor = 'black';
        }

        document.querySelector( '#blackjack-result' ).textContent = message;
        document.querySelector( '#blackjack-result' ).style.color = messageColor;
    }
}
