let nickname;
let points=50000;
let bgLevel=1;
let chart;
let nextChangeTime;

const CHANGE_INTERVAL = 3600000; // 1時間

const stockConfig=[
{name:"Tech",unlockCost:0,personality:"growth",flavor:"未来を切り開く革新企業。"},
{name:"Energy",unlockCost:0,personality:"stable",flavor:"安定供給の巨人。"},
{name:"Game",unlockCost:0,personality:"volatile",flavor:"ヒット次第で爆上がり。"},
{name:"AI",unlockCost:15000,personality:"growth",flavor:"急成長AI市場。"},
{name:"Food",unlockCost:20000,personality:"stable",flavor:"不況に強い。"},
{name:"Auto",unlockCost:30000,personality:"stable",flavor:"伝統と革新。"},
{name:"Space",unlockCost:50000,personality:"risky",flavor:"夢と暴落。"},
{name:"Medical",unlockCost:80000,personality:"growth",flavor:"医療革命。"},
{name:"Crypto",unlockCost:120000,personality:"volatile",flavor:"乱高下の王。"},
{name:"Media",unlockCost:200000,personality:"risky",flavor:"流行で爆発。"}
];

let stocks=stockConfig.map(s=>({
...s,
price:Math.floor(Math.random()*100)+50,
owned:0,
unlocked:s.unlockCost===0,
history:[],
lockedShares:0
}));

stocks.forEach(s=>s.history.push(s.price));

const newsList=[
{text:"好景気",effect:20},
{text:"暴落",effect:-20},
{text:"技術革新",effect:15},
{text:"金融不安",effect:-15},
{text:"安定相場",effect:0}
];

function trade(i,amount){
const stock=stocks[i];
if(!stock.unlocked)return;

if(amount>0){
let cost=stock.price*amount;
if(points>=cost){
points-=cost;
stock.owned+=amount;
stock.lockedShares+=amount;
}
}else{
let sell=Math.abs(amount);
let sellable=stock.owned-stock.lockedShares;
if(sell>sellable){
alert("この変動中に買った株は売れません");
return;
}
points+=stock.price*sell;
stock.owned-=sell;
}
saveGame();
renderStocks();
updateDisplay();
}

function marketUpdateCore(){
const news=newsList[Math.floor(Math.random()*newsList.length)];
stocks.forEach(stock=>{
if(stock.unlocked){
let change;
switch(stock.personality){
case "stable":change=Math.floor(Math.random()*5)-2;break;
case "volatile":change=Math.floor(Math.random()*21)-10;break;
case "growth":change=Math.floor(Math.random()*8)+1;break;
case "risky":change=Math.floor(Math.random()*31)-15;break;
}
stock.price+=change+news.effect;
if(stock.price<10)stock.price=10;
stock.history.push(stock.price);
stock.lockedShares=0; // 変動で解除
}
});
return news.text;
}

function processOfflineProgress(){
const now=Date.now();
if(!nextChangeTime){
nextChangeTime=now+CHANGE_INTERVAL;
return;
}
let count=0;
while(now>=nextChangeTime){
marketUpdateCore();
nextChangeTime+=CHANGE_INTERVAL;
count++;
}
if(count>0){
document.getElementById("news").innerText=
"オフライン中に "+count+" 回変動";
}
}

function startTimer(){
setInterval(()=>{
let now=Date.now();
if(now>=nextChangeTime){
let text=marketUpdateCore();
document.getElementById("news").innerText=text;
nextChangeTime=now+CHANGE_INTERVAL;
updateChart();
}
let remain=nextChangeTime-now;
let m=Math.floor(remain/60000);
let s=Math.floor((remain%60000)/1000);
document.getElementById("timer").innerText=m+"分 "+s+"秒";
saveGame();
},1000);
}

function saveGame(){
localStorage.setItem("gameData",JSON.stringify({
points,stocks,bgLevel,nextChangeTime
}));
}

function loadGame(){
const saved=JSON.parse(localStorage.getItem("gameData"));
if(saved){
points=saved.points;
stocks=saved.stocks;
bgLevel=saved.bgLevel;
nextChangeTime=saved.nextChangeTime;
}
}

/* 粒子 */
const canvasP=document.getElementById("particles");
const ctxP=canvasP.getContext("2d");
canvasP.width=window.innerWidth;
canvasP.height=window.innerHeight;

let particles=[];
for(let i=0;i<100;i++){
particles.push({
x:Math.random()*canvasP.width,
y:Math.random()*canvasP.height,
r:Math.random()*2+1,
dx:(Math.random()-0.5)*0.5,
dy:(Math.random()-0.5)*0.5
});
}

function animateParticles(){
ctxP.clearRect(0,0,canvasP.width,canvasP.height);
particles.forEach(p=>{
p.x+=p.dx;
p.y+=p.dy;
if(p.x<0||p.x>canvasP.width)p.dx*=-1;
if(p.y<0||p.y>canvasP.height)p.dy*=-1;
ctxP.beginPath();
ctxP.arc(p.x,p.y,p.r,0,Math.PI*2);
ctxP.fillStyle="#00f5ff";
ctxP.shadowBlur=10;
ctxP.shadowColor="#00f5ff";
ctxP.fill();
});
requestAnimationFrame(animateParticles);
}
animateParticles();

/* BGM */
function toggleBGM(){
const bgm=document.getElementById("bgm");
if(bgm.paused){bgm.play();}
else{bgm.pause();}
}
