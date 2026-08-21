const cafe=document.getElementById("cafe");
const moneyEl=document.getElementById("money");
const customersEl=document.getElementById("customers");
const ratingEl=document.getElementById("rating");
const dayEl=document.getElementById("day");
const statusEl=document.getElementById("status");
const logEl=document.getElementById("log");
const tableEls=[...document.querySelectorAll(".table")];

let money=500;
let customers=0;
let day=1;
let rating=1.0;
let upgradeLevel=0;
const busy=[false,false,false,false];

const names=["Ahmet","Zeynep","Mehmet","Elif","Can","Ece","Mert","Duru","Burak","Selin"];
const faces=["🙂","😄","😎","😊","👨‍🦱","👩","🧔","👨","👩‍🦰","🧑"];

function ui(){
  moneyEl.textContent=Math.floor(money);
  customersEl.textContent=customers;
  ratingEl.textContent=rating.toFixed(1);
  dayEl.textContent=day;
}

function notify(text){
  logEl.textContent=text;
  const old=document.querySelector(".toast"); if(old) old.remove();
  const t=document.createElement("div"); t.className="toast"; t.textContent=text;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),1800);
}

function freeTable(){
  const free=busy.map((v,i)=>v?null:i).filter(v=>v!==null);
  return free.length?free[Math.floor(Math.random()*free.length)]:-1;
}

function spawnCustomer(){
  const ti=freeTable();
  if(ti<0){statusEl.textContent="Tüm masalar dolu!";return}
  busy[ti]=true; customers++; ui();
  statusEl.textContent="Müşteri geldi!";
  const c=document.createElement("div");
  c.className="customer";
  const name=names[Math.floor(Math.random()*names.length)];
  const face=faces[Math.floor(Math.random()*faces.length)];
  c.innerHTML=`<div class="customer-body">${face}</div><div class="customer-name">${name}</div>`;
  c.style.left=(Math.random()*78+8)+"%"; c.style.top="-12%";
  c.style.animation="arrive .4s ease";
  cafe.appendChild(c);

  const table=tableEls[ti];
  const tx=parseFloat(table.style.left)+4;
  const ty=parseFloat(table.style.top)-8;
  setTimeout(()=>{c.style.left=tx+"%";c.style.top=ty+"%";},120);

  setTimeout(()=>{
    c.querySelector(".customer-body").textContent="☕";
    c.querySelector(".customer-name").textContent=name+" sipariş veriyor";
    table.classList.add("occupied");
    notify("☕ "+name+" siparişini aldı!");
  },1900);

  const stay=4000+Math.random()*3500;
  setTimeout(()=>{
    c.querySelector(".customer-body").textContent="😊";
    c.querySelector(".customer-name").textContent="Teşekkürler!";
  },1900+stay-1100);

  setTimeout(()=>{
    c.style.top="-14%";
    table.classList.remove("occupied");
    busy[ti]=false; customers--; ui();

    const coin=document.createElement("button");
    coin.className="coin"; coin.textContent="🪙"; coin.setAttribute("aria-label","Parayı topla");
    coin.onclick=()=>{
      money+=25+upgradeLevel*5;
      rating=Math.min(5,rating+0.03);
      ui(); coin.remove();
      notify("🪙 Para toplandı! +"+(25+upgradeLevel*5)+" TL");
    };
    table.appendChild(coin);
    setTimeout(()=>c.remove(),1700);
  },1900+stay);
}

document.getElementById("serveBtn").onclick=()=>{
  if(money<10){notify("💸 Servis için paran yetmiyor!");return}
  money+=10; rating=Math.min(5,rating+0.05); ui(); notify("🍰 Hızlı servis yaptın! +10 TL");
};

document.getElementById("upgradeBtn").onclick=()=>{
  const cost=150+upgradeLevel*100;
  if(money<cost){notify("💸 Geliştirme için "+cost+" TL gerekiyor.");return}
  money-=cost; upgradeLevel++; rating=Math.min(5,rating+.2);
  ui(); notify("🔨 Kafen geliştirildi! Seviye "+upgradeLevel);
};

document.getElementById("dayBtn").onclick=()=>{
  if(customers>0){notify("⏳ Önce müşterilerin kalkmasını bekle!");return}
  day++; money+=75+upgradeLevel*20; rating=Math.min(5,rating+.1);
  ui(); notify("🌅 Yeni gün! +"+(75+upgradeLevel*20)+" TL");
};

ui();
setTimeout(spawnCustomer,900);
setInterval(spawnCustomer,4200);
setInterval(()=>{if(Math.random()<.65)spawnCustomer()},6500);
