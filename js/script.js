// ════════════════════════════════
//   CONFIG — EDIT DI SINI
// ════════════════════════════════
const PIN = "0000"; // ← PIN untuk membuka

const QS = [
  {
    q: "Dari 1–4, seberapa spesial kamu merasa hari ini? 🌟",
    opts: ["1 — Biasa aja...", "2 — Lumayan spesial", "3 — Cukup spesial!", "4 — Sangat spesial! 🥰"]
  },
  {
    q: "Kalau boleh jujur, apa yang paling kamu harapkan hari ini? 💭",
    opts: ["Hadiah dari seseorang 🎁", "Diingat & disayang orang tersayang", "Liburan bareng 🌴", "Semua hal baik datang! ✨"]
  },
  {
    q: "Satu kata untuk perasaanmu sekarang? 🌸",
    opts: ["Bahagia 😊", "Terharu 🥺", "Excited 🎉", "Penasaran sama surprise ini 👀"]
  },
  {
    q: "Siapa yang paling ingin kamu peluk hari ini? 🤗",
    opts: ["Seseorang yang spesial 💕", "Keluarga tercinta", "Sahabat terbaik", "Semua orang tersayang!"]
  }
];
// ════════════════════════════════

let pin = "", qi = 0;
let responses = ["", "", "", ""]; // Track jawaban user

// Particles
const pc = document.getElementById('ptcl');
for(let i=0;i<30;i++){
  const el=document.createElement('div');
  el.className='p';
  el.style.cssText=`left:${Math.random()*100}vw;width:${2+Math.random()*5}px;height:${2+Math.random()*5}px;background:${Math.random()>.6?'#e8a0b0':'#d4a96a'};animation-duration:${7+Math.random()*12}s;animation-delay:${Math.random()*15}s`;
  pc.appendChild(el);
}

// Hearts background
const hbg = document.getElementById('hbg');
setInterval(()=>{
  const h=document.createElement('div');
  h.className='hb';
  h.textContent=['💕','🌹','✨','💖'][Math.floor(Math.random()*4)];
  h.style.cssText=`left:${Math.random()*100}vw;bottom:${Math.random()*10}vh;font-size:${12+Math.random()*14}px;animation-duration:${10+Math.random()*14}s`;
  hbg.appendChild(h);
  setTimeout(()=>h.remove(),24000);
},1800);

// PIN logic
function press(n){
  if(pin.length>=4) return;
  pin+=n;
  document.getElementById('d'+(pin.length-1)).classList.add('on');
  if(pin.length===4) setTimeout(checkPin,350);
}

function delPin(){
  if(!pin.length) return;
  document.getElementById('d'+(pin.length-1)).classList.remove('on');
  pin=pin.slice(0,-1);
  document.getElementById('err').classList.remove('on');
}

function checkPin(){
  if(pin===PIN){
    go('s-pin','s-q');
    setTimeout(showQ,300);
  } else {
    const e=document.getElementById('err');
    e.classList.add('on');
    setTimeout(()=>{
      e.classList.remove('on');
      pin='';
      for(let i=0;i<4;i++) document.getElementById('d'+i).classList.remove('on');
    },1600);
  }
}

// Questions
function showQ(){
  const q=QS[qi];
  document.getElementById('prog').style.width=(qi/QS.length*100)+'%';
  document.getElementById('qtext').textContent=q.q;
  const opts=document.getElementById('opts');
  opts.innerHTML='';
  q.opts.forEach(o=>{
    const b=document.createElement('button');
    b.className='ob';
    b.textContent=o;
    b.onclick=()=>pick(b);
    opts.appendChild(b);
  });
}

function pick(btn){
  document.querySelectorAll('.ob').forEach(b=>b.classList.remove('sel'));
  btn.classList.add('sel');
  const selectedAnswer = btn.textContent;
  responses[qi] = selectedAnswer; // Simpan jawaban
  
  setTimeout(()=>{
    qi++;
    if(qi<QS.length){
      showQ();
    } else {
      go('s-q','s-sp');
    }
  },550);
}

function goMsg(){
  go('s-sp','s-msg');
  
  // Simpan jawaban ke Supabase via API
  saveResponses();
  
  setTimeout(burst,500);
}

// Function untuk kirim data ke API
async function saveResponses(){
  try {
    const payload = {
      userName: "Tsal Nastiti Kama Dewi",
      question1: responses[0],
      question2: responses[1],
      question3: responses[2],
      question4: responses[3]
    };
    
    const response = await fetch('/api/saveResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Jawaban berhasil tersimpan
    }
  } catch (err) {
    // Error handling
  }
}

function go(from,to){
  document.getElementById(from).classList.add('slide-out');
  setTimeout(()=>{
    document.getElementById(from).classList.add('hidden');
    document.getElementById(to).classList.remove('hidden');
  },750);
}

// Heart burst on message screen
function burst(){
  const f=document.getElementById('floaters');
  const em=['💕','🌸','✨','💖','🌹','💝','🎉','⭐','🎀','💗'];
  let n=0;
  const iv=setInterval(()=>{
    const h=document.createElement('div');
    h.className='fh';
    h.textContent=em[Math.floor(Math.random()*em.length)];
    h.style.cssText=`left:${Math.random()*100}vw;font-size:${14+Math.random()*20}px;animation-duration:${5+Math.random()*7}s`;
    f.appendChild(h);
    setTimeout(()=>h.remove(),12000);
    if(++n>60) clearInterval(iv);
  },150);
}

// Initialize Spotify embed on page load
window.addEventListener('load',()=>{
  // Load Spotify embed script
  const script=document.createElement('script');
  script.async=true;
  script.src='https://open.spotify.com/embed/info/latest/embed.js';
  document.body.appendChild(script);
});

function goToQ(){
  go('s-intro','s-q');
  setTimeout(showQ,300);
}
