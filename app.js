import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* FIREBASE */
const firebaseConfig = {
  apiKey: "AIzaSyB2XTrUWKtWd_Pn3_8MJ5uZ7ysSO72ytdI",
  authDomain: "pedidos-locales.firebaseapp.com",
  projectId: "pedidos-locales",
  storageBucket: "pedidos-locales.firebasestorage.app",
  messagingSenderId: "1069589244691",
  appId: "1:1069589244691:web:a8f8da4f9091001736c8e6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* VARIABLES */
let negocios = [];
let carrito = {};
let negocioActual = null;
let envio = 30;

/* 🔥 REALTIME */
onSnapshot(collection(db, "negocios"), (snapshot) => {
  negocios = [];
  snapshot.forEach(docu => {
    negocios.push({ id: docu.id, ...docu.data() });
  });
  renderHome();
});

/* HOME */
function renderHome(){
let cont = document.getElementById("home");
cont.innerHTML = "";

let ordenados = [...negocios].sort((a,b)=>b.destacado-a.destacado);

ordenados.forEach((n,i)=>{
if(!n.activo) return;

cont.innerHTML += `
<div class="card" onclick="verMenu(${i})">
${n.destacado ? '<div class="badge">⭐ Destacado</div>' : ''}
<div>
<h3>${n.nombre}</h3>
<p>${n.direccion}</p>
</div>
<img src="${n.imagen}">
</div>`;
});
}

/* MENU */
window.verMenu = function(i){
negocioActual = negocios[i];
carrito = {};

document.getElementById("home").style.display="none";
document.getElementById("menu").style.display="block";
document.getElementById("titulo").innerText = negocioActual.nombre;

let m = document.getElementById("menu");
m.innerHTML = `<button onclick="volver()">⬅ Volver</button>`;

(negocioActual.productos || []).forEach((p,i)=>{
m.innerHTML += `
<div class="product">
<div>
<div class="product-name">${p.nombre}</div>
<div class="product-price">$${p.precio}</div>
</div>

<div class="qty">
<button onclick="cambiar(${i},-1)">-</button>
<span id="q${i}">0</span>
<button onclick="cambiar(${i},1)">+</button>
</div>
</div>`;
});
}

/* CARRITO */
window.cambiar = function(i,d){
let p = negocioActual.productos[i];
let k = p.nombre;

carrito[k] = (carrito[k]||0) + d;
if(carrito[k] <= 0) delete carrito[k];

document.getElementById("q"+i).innerText = carrito[k] || 0;
renderCart();
}

function renderCart(){
let c = document.getElementById("cart-items");
let fab = document.getElementById("fab");

c.innerHTML="";
let total=0, count=0;

for(let k in carrito){
let p = negocioActual.productos.find(x=>x.nombre==k);
let cant = carrito[k];
let sub = p.precio*cant;

total += sub;
count += cant;

c.innerHTML += `<div class="cart-item">${k} x${cant} = $${sub}</div>`;
}

if(count>0){
total += envio;
c.innerHTML += `<div class="cart-item">Envío = $${envio}</div>`;
}

c.innerHTML += `<div class="cart-item"><b>Total: $${total}</b></div>`;

fab.style.display = count>0 ? "block" : "none";
document.getElementById("total-fab").innerText = total;
}

/* CARRITO UI */
window.toggleCart = function(){
document.getElementById("cart").classList.toggle("active");
}

/* PEDIDO */
window.enviarPedido = function(){
let dir = document.getElementById("direccion").value;
if(!dir) return alert("Pon dirección");

let msg = `🧾 Pedido\n\n🏪 ${negocioActual.nombre}\n📍 ${negocioActual.direccion}\n\n`;

let total=0;

for(let k in carrito){
let p = negocioActual.productos.find(x=>x.nombre==k);
let cant = carrito[k];
let sub = p.precio*cant;

msg += `- ${k} x${cant} = $${sub}\n`;
total += sub;
}

total += envio;

msg += `\n🚚 Envío: $${envio}`;
msg += `\n💰 Total: $${total}`;
msg += `\n📍 ${dir}`;

window.open(`https://wa.me/52${negocioActual.telefono}?text=${encodeURIComponent(msg)}`);
}

/* VOLVER */
window.volver = function(){
document.getElementById("home").style.display="block";
document.getElementById("menu").style.display="none";
document.getElementById("titulo").innerText="Pedidos CD Caucel";
}

/* ADMIN */
window.login = function(){
if(document.getElementById("pass").value==="1234"){
document.getElementById("form-negocio").style.display="block";
alert("Admin activado");
}
}

/* GUARDAR NEGOCIO */
window.guardarNegocio = async function(){

let nombre = document.getElementById("n-nombre").value;
let direccion = document.getElementById("n-direccion").value;
let imagen = document.getElementById("n-imagen").value;
let telefono = document.getElementById("n-telefono").value;

let pNombre = document.getElementById("p-nombre").value;
let pPrecio = Number(document.getElementById("p-precio").value);
let pImg = document.getElementById("p-img").value;

await addDoc(collection(db,"negocios"),{
nombre,
direccion,
imagen,
telefono,
activo:true,
destacado:false,
productos:[{nombre:pNombre,precio:pPrecio,img:pImg}]
});

alert("Negocio agregado");
}
