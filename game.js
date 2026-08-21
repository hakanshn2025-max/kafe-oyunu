let money = 500;
let tableCount = 4;
let customerCount = 0;

const tables = [];

const customers = [
  "👨",
  "👩",
  "👨‍🦱",
  "👩‍🦰",
  "🧔",
  "👩‍🦱",
  "👨‍🦰",
  "👵",
  "👴"
];

function updateMoney() {
  document.getElementById("money").textContent = money;
}

function updateCustomers() {
  document.getElementById("customers").textContent = customerCount;
}

function updateTables() {
  document.getElementById("tableNumber").textContent = tableCount;
}

function createTables() {
  const container = document.getElementById("tables");
  container.innerHTML = "";

  for (let i = 0; i < tableCount; i++) {
    const table = document.createElement("div");

    table.className = "table";
    table.id = "table-" + i;

    table.innerHTML = `
      <div class="customer"></div>
      <div class="table-top">🪑</div>
      <div class="table-status">BOŞ</div>
    `;

    container.appendChild(table);

    tables[i] = {
      element: table,
      busy: false,
      money: 0
    };
  }
}

function customerArrives() {
  const emptyTable = tables.find(table => !table.busy);

  if (!emptyTable) {
    document.getElementById("status").textContent =
      "Tüm masalar dolu 😅";
    return;
  }

  emptyTable.busy = true;

  customerCount++;
  updateCustomers();

  const customer =
    customers[Math.floor(Math.random() * customers.length)];

  const customerElement =
    emptyTable.element.querySelector(".customer");

  const status =
    emptyTable.element.querySelector(".table-status");

  customerElement.textContent = customer;
  customerElement.classList.add("visible");

  status.textContent = "☕ SİPARİŞ VERİYOR";

  document.getElementById("status").textContent =
    "Yeni müşteri geldi! ☕";

  const waitTime =
    5000 + Math.random() * 7000;

  setTimeout(() => {
    customerLeaves(emptyTable);
  }, waitTime);
}

function customerLeaves(table) {

  const customerElement =
    table.element.querySelector(".customer");

  const status =
    table.element.querySelector(".table-status");

  const earnings =
    30 + Math.floor(Math.random() * 71);

  table.money = earnings;

  customerElement.classList.remove("visible");

  setTimeout(() => {
    customerElement.textContent = "";
  }, 300);

  status.innerHTML = `
    <button class="money-button"
      onclick="collectMoney(${tables.indexOf(table)})">
      💰 +${earnings} TL
    </button>
  `;

  customerCount--;
  updateCustomers();

  document.getElementById("status").textContent =
    "Müşteri hesabı ödedi! 💰";
}

function collectMoney(index) {

  const table = tables[index];

  if (!table || table.money <= 0) return;

  money += table.money;

  table.money = 0;
  table.busy = false;

  updateMoney();

  table.element.querySelector(".customer").textContent = "";

  table.element.querySelector(".table-status").textContent =
    "BOŞ";

  document.getElementById("status").textContent =
    "Para kasaya eklendi! 💰";

  setTimeout(() => {
    customerArrives();
  }, 1500);
}

function addTable() {

  if (money < 250) {
    alert("Masa almak için 250 TL gerekiyor!");
    return;
  }

  money -= 250;
  tableCount++;

  updateMoney();
  updateTables();

  createTables();

  document.getElementById("status").textContent =
    "Yeni masa satın alındı! 🪑";
}

function upgradeCafe() {

  if (money < 500) {
    alert("Kafeyi geliştirmek için 500 TL gerekiyor!");
    return;
  }

  money -= 500;

  updateMoney();

  document.getElementById("status").textContent =
    "🎉 Kafen geliştirildi! Müşteriler daha hızlı geliyor.";

  setTimeout(() => {
    customerArrives();
  }, 1000);
}

createTables();

updateMoney();
updateCustomers();
updateTables();

setInterval(() => {

  const available =
    tables.some(table => !table.busy);

  if (available) {
    customerArrives();
  }

}, 6000);

setTimeout(() => {
  customerArrives();
}, 2000);
