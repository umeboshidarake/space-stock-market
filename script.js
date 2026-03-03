let nickname;
let points = 10000;
let stockPrice = 100;
let stockOwned = 0;
let history = [stockPrice];

function startGame() {
    nickname = document.getElementById("nicknameInput").value;
    if (!nickname) return;

    localStorage.setItem("nickname", nickname);

    document.getElementById("nicknameScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";
    document.getElementById("playerName").innerText = nickname;

    updateDisplay();
    startStockFluctuation();
    createChart();
}

function updateDisplay() {
    document.getElementById("points").innerText = points;
    document.getElementById("stockPrice").innerText = stockPrice;
}

function buyStock() {
    if (points >= stockPrice) {
        points -= stockPrice;
        stockOwned++;
        updateDisplay();
    }
}

function sellStock() {
    if (stockOwned > 0) {
        points += stockPrice;
        stockOwned--;
        updateDisplay();
    }
}

function startStockFluctuation() {
    setInterval(() => {
        let change = Math.floor(Math.random() * 21) - 10;
        stockPrice += change;
        if (stockPrice < 10) stockPrice = 10;

        history.push(stockPrice);
        updateChart();
        updateDisplay();
    }, 3600000); // 1時間（テストは5000とかにしてOK）
}

let chart;

function createChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.map((_, i) => i),
            datasets: [{
                label: '株価',
                data: history
            }]
        }
    });
}

function updateChart() {
    chart.data.labels = history.map((_, i) => i);
    chart.data.datasets[0].data = history;
    chart.update();
}
