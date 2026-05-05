import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

let negocios = [];
let carrito = {};
let negocioActual = null;
let envio = 30;

/* 🔥 CARGAR DATOS */
onSnapshot(collection(db, "negocios"), snap => {
  negocios = [];
  snap.forEach(d => negocios.push({id:d.id,...d.data()}));
  renderHome();
});

/* HOME */
function renderHome(){
let cont = document.getElementById("home");
cont.innerHTML = "";

negocios.sort((a,b)=>b.destacado-a.destacado);

negocios.forEach((n,i)=>{
if(!n.activo) return;

cont.innerHTML += `
<div class="card" onclick="verMenu(${i})">
${n.destacado ? '<div class="badge">⭐</div>' : ''}
<div>
<b>${n.nombre}</b><br>
${n.direccion}
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

let m = document.getElementById("menu");
m.innerHTML = `<button onclick="volver()">⬅</button>`;

negocioActual.productos.forEach((p,i)=>{
m.innerHTML += `
<div class="product">
${p.nombre} $${p.precio}
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

carrito[k]=(carrito[k]||0)+d;
if(carrito[k]<=0) delete carrito[k];

document.getElementById("q"+i).innerText=carrito[k]||0;
}

/* VOLVER */
window.volver = function(){
document.getElementById("home").style.display="block";
document.getElementById("menu").style.display="none";
}

/* ADMIN */
window.login = function(){
if(document.getElementById("pass").value==="1234"){
document.getElementById("form-negocio").style.display="block";
alert("Admin activado");
}
}

/* 🔥 GUARDAR NEGOCIO */
window.guardarNegocio = async function(){

let nombre = nNombre.value;
let direccion = nDireccion.value;
let imagen = nImagen.value;
let telefono = nTelefono.value;

let pNombre = pNombreInput.value;
let pPrecio = Number(pPrecioInput.value);
let pImg = pImgInput.value;

await addDoc(collection(db,"negocios"),{
nombre,
direccion,
imagen,
telefono,
activo:true,
destacado:false,
productos:[{nombre:pNombre,precio:pPrecio,img:pImg}]
});

alert("Guardado");
}
