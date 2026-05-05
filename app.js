// 🔥 IMPORTAR FIREBASE DIRECTO
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, updateDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* CONFIG */
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

console.log("🔥 Firebase listo desde app.js");

/* VARIABLES */
let envio = 30;
let negocios = [];
let carrito = {}, negocioActual = null;

/* 🔥 REALTIME */
function cargarNegociosRealtime(){
  const ref = collection(db, "negocios");

  onSnapshot(ref, (snapshot) => {
    negocios = [];

    snapshot.forEach(docu => {
      negocios.push({
        id: docu.id,
        ...docu.data()
      });
    });

    console.log("🔥 Datos:", negocios);
    renderHome();
  });
}

/* HOME */
function renderHome(){
let cont=document.getElementById("home");
cont.innerHTML="";

let ordenados=[...negocios].sort((a,b)=>b.destacado-a.destacado);

ordenados.forEach(n=>{
if(!n.activo)return;
let i=negocios.indexOf(n);

cont.innerHTML+=`
<div class="card" onclick="verMenu(${i})">
${n.destacado?'<div class="badge">⭐ Destacado</div>':''}
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
negocioActual=negocios[i];
carrito={};

document.getElementById("home").style.display="none";
document.getElementById("menu").style.display="block";
document.getElementById("titulo").innerText=negocioActual.nombre;

let m=document.getElementById("menu");
m.innerHTML=`<button onclick="volver()">⬅ Volver</button>`;

(negocioActual.productos || []).forEach((p,i)=>{
m.innerHTML+=`
<div class="product">
<div class="product-left">
<img src="${p.img}">
<div>${p.nombre}<br>$${p.precio}</div>
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
let prod=negocioActual.productos[i];
let k=prod.nombre;

carrito[k]=(carrito[k]||0)+d;
if(carrito[k]<=0)delete carrito[k];

document.getElementById("q"+i).innerText=carrito[k]||0;
renderCart();
}

function renderCart(){
let c=document.getElementById("cart-items");
let fab=document.getElementById("fab");

c.innerHTML="";
let total=0,count=0;

for(let k in carrito){
let prod=negocioActual.productos.find(p=>p.nombre==k);
let cant=carrito[k];
let subtotal=prod.precio*cant;

total+=subtotal;
count+=cant;

c.innerHTML+=`
<div class="cart-item">
${k} x${cant} = $${subtotal}
</div>`;
}

if(count>0){
total+=envio;
c.innerHTML+=`<div class="cart-item">Envío = $${envio}</div>`;
}

c.innerHTML+=`<div class="cart-item"><b>Total: $${total}</b></div>`;

if(count>0){
fab.style.display="block";
document.getElementById("total-fab").innerText=total;
}else fab.style.display="none";
}

window.toggleCart = function(){
document.getElementById("cart").classList.toggle("active");
}

/* PEDIDO */
window.enviarPedido = function(){
let dir=document.getElementById("direccion").value;
if(!dir)return alert("Pon dirección");

let msg=`🧾 *Pedido*\n\n`;
msg+=`🏪 *${negocioActual.nombre}*\n`;
msg+=`📍 ${negocioActual.direccion}\n\n`;

let total=0;

for(let k in carrito){
let p=negocioActual.productos.find(x=>x.nombre==k);
let cant=carrito[k];
let subtotal=p.precio*cant;
msg+=`- ${k} x${cant} = $${subtotal}\n`;
total+=subtotal;
}

total+=envio;

msg+=`\n🚚 Envío: $${envio}\n`;
msg+=`\n💰 *Total: $${total}*\n\n`;
msg+=`📍 Entregar en: ${dir}`;

let url=`https://wa.me/52${negocioActual.telefono}?text=${encodeURIComponent(msg)}`;
window.open(url);
}

/* VOLVER */
window.volver = function(){
document.getElementById("home").style.display="block";
document.getElementById("menu").style.display="none";
document.getElementById("titulo").innerText="Pedidos CD Caucel";
}

/* ADMIN */
window.login = function(){
let pass=document.getElementById("pass").value;

if(pass==="1234"){
let panel=document.getElementById("admin-panel");
panel.innerHTML="<h4>Administrar negocios</h4>";

negocios.forEach((n,i)=>{
panel.innerHTML+=`
<div style="background:white;padding:10px;margin:8px 0;border-radius:10px;">
<div style="display:flex;justify-content:space-between;">
<span>${n.nombre}</span>
<button onclick="toggle(${i})">${n.activo?"Activo":"Inactivo"}</button>
</div>

<button onclick="toggleDestacado(${i})" style="
margin-top:5px;
background:${n.destacado?'gold':'#ccc'};
border:none;
padding:5px 8px;
border-radius:6px;">
⭐ ${n.destacado?"Destacado":"No destacado"}
</button>

</div>`;
});
}else alert("Contraseña incorrecta");
}

/* FIREBASE UPDATE */
window.toggle = async function(i){
let n = negocios[i];
await updateDoc(doc(db, "negocios", n.id), { activo: !n.activo });
}

window.toggleDestacado = async function(i){
let n = negocios[i];
await updateDoc(doc(db, "negocios", n.id), { destacado: !n.destacado });
}

/* START */
cargarNegociosRealtime();
