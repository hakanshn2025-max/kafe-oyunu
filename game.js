const cafe = document.querySelector(".cafe");
const moneyDisplay = document.querySelector("#money");
const customersDisplay = document.querySelector("#customers");
const dayDisplay = document.querySelector("#day");

let money = 100;
let customers = 0;
let day = 1;

const tables = [
    { x: 8, y: 18 },
    { x: 52, y: 18 },
    { x: 8, y: 48 },
    { x: 52, y: 48 }
];

const occupied = [false, false, false, false];

function updateUI() {
    moneyDisplay.textContent = money + " ₺";
    customersDisplay.textContent = customers;
    dayDisplay.textContent = "Gün " + day;
}

function createTables() {
    tables.forEach((pos, index) => {
        const table = document.createElement("div");

        table.className = "table";
        table.style.left = pos.x + "%";
        table.style.top = pos.y + "%";
        table.dataset.index = index;

        table.innerHTML = `
            <span class="table-number">Masa ${index + 1}</span>
        `;

        cafe.appendChild(table);
    });
}

function findFreeTable() {
    for (let i = 0; i < occupied.length; i++) {
        if (!occupied[i]) {
            return i;
        }
    }

    return -1;
}

function spawnCustomer() {

    const tableIndex = findFreeTable();

    if (tableIndex === -1) {
        return;
    }

    occupied[tableIndex] = true;
    customers++;

    const customer = document.createElement("div");
    customer.className = "customer";

    const startX = Math.random() * 80 + 10;

    customer.style.left = startX + "%";
    customer.style.top = "2%";

    customer.innerHTML = `
        <div class="customer-body">🙂</div>
        <div class="customer-name">Müşteri</div>
    `;

    cafe.appendChild(customer);

    const table = document.querySelector(
        `.table[data-index="${tableIndex}"]`
    );

    const targetX = tables[tableIndex].x + 5;
    const targetY = tables[tableIndex].y - 7;

    setTimeout(() => {

        customer.style.transition = "all 2s ease";

        customer.style.left = targetX + "%";
        customer.style.top = targetY + "%";

    }, 100);

    setTimeout(() => {

        customer.style.transition = "none";

        table.classList.add("occupied");

        customer.innerHTML = `
            <div class="customer-body">☕</div>
            <div class="customer-name">Sipariş veriyor</div>
        `;

    }, 2200);

    const stayTime = 4000 + Math.random() * 4000;

    setTimeout(() => {

        customer.innerHTML = `
            <div class="customer-body">😊</div>
            <div class="customer-name">Teşekkürler!</div>
        `;

    }, 2200 + stayTime - 1000);

    setTimeout(() => {

        customer.style.transition = "all 1.5s ease";

        customer.style.top = "-15%";

        const coin = document.createElement("div");

        coin.className = "money-coin";
        coin.textContent = "₺";

        coin.onclick = function () {

            money += 20;

            updateUI();

            coin.remove();

            showNotification("+20 ₺ kazandın! 💰");

        };

        table.appendChild(coin);

        table.classList.remove("occupied");

        occupied[tableIndex] = false;

        customers--;

        updateUI();

        setTimeout(() => {
            customer.remove();
        }, 1600);

    }, 2200 + stayTime);
}

function showNotification(text) {

    const notification = document.createElement("div");

    notification.className = "notification";
    notification.textContent = text;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 1800);
}

function newDay() {

    day++;

    money += 50;

    updateUI();

    showNotification("Yeni gün başladı! ☀️ +50 ₺");

}

createTables();
updateUI();

setInterval(() => {

    spawnCustomer();

}, 3500);

setInterval(() => {

    if (Math.random() > 0.5) {
        spawnCustomer();
    }

}, 7000);
