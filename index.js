const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

function deposit() {
    while (true) {
        const depositAmount = prompt("Enter your deposit: ");
        const parsedDepositAmount = parseFloat(depositAmount);

        if (isNaN(parsedDepositAmount) || parsedDepositAmount < 0) {
            console.log("Invalid deposit amount, try again");
        } else {
            return parsedDepositAmount;
        }
    }
}

function getNumberOfLines() {
    while (true) {
        const numberOfLines = prompt("Enter the number of lines to bet on (1-3):  ");
        const parsedNumberOfLines = parseFloat(numberOfLines);

        if (isNaN(parsedNumberOfLines) || parsedNumberOfLines <= 0 || parsedNumberOfLines > 3) {
            console.log("Invalid lines amount, try again");
        } else {
            return parsedNumberOfLines;
        }
    }
}

function getBet(balance, lines) {
    while (true) {
        const bet = prompt("Enter the total bet: ");
        const parsedBet = parseFloat(bet);

        if (isNaN(parsedBet) || parsedBet <= 0 || parsedBet > balance / lines) {
            console.log("Invalid bet, try again");
        } else {
            return parsedBet;
        }
    }
}

function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; ++i) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; ++i) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; ++j) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }    
    }
    return reels;
}

function transpose(reels) {
    const rows = [];
    for (let i = 0; i < ROWS; ++i) {
        rows.push([]);
        for (let j = 0; j < COLS; ++j) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

function printRows(rows) {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

function getWinnings(rows, bet, lines) {
    let winnings = 0;
    for (let row = 0; row < lines; ++row) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}

function game() {
    let balance = deposit();
    while (true) {
        console.log("You have a balance of $" + balance);
        const lines = getNumberOfLines();
        const bet = getBet(balance, lines);
        balance -= bet * lines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        console.log("You won, $" + winnings);
        if (balance === 0) {
            console.log("You ran out of money!");
            break;
        }
        const playAgain = prompt("Do you want to play again? (y/n) ");
        if (playAgain != "y") break;
    }
}

game();