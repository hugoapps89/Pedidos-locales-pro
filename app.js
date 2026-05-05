let envio=30;

let negocios = [
{
nombre:"Tienda La Esquina",
direccion:"Calle 45 x 120",
imagen:"https://images.unsplash.com/photo-1604719312566-8912e9c8a213",
telefono:"9995131376",
activo:true,
destacado:false,
productos:[
{nombre:"Coca Cola",precio:20,img:"https://i.imgur.com/8Km9tLL.jpg"},
{nombre:"Pan dulce",precio:10,img:"https://i.imgur.com/UPrs1EW.jpg"}
]
},
{
nombre:"Papelería Lupita",
direccion:"Calle 60 x 115",
imagen:"https://images.unsplash.com/photo-1588072432836-e10032774350",
telefono:"9995131376",
activo:true,
destacado:false,
productos:[
{nombre:"Cuaderno",precio:35,img:"https://i.imgur.com/BoN9kdC.png"},
{nombre:"Pluma",precio:8,img:"https://i.imgur.com/kdXkV6x.png"}
]
},
{
nombre:"Tlapalería El Tornillo",
direccion:"Calle 50 x 130",
imagen:"https://images.unsplash.com/photo-1581578731548-c64695cc6952",
telefono:"9995131376",
activo:true,
destacado:false,
productos:[
{nombre:"Martillo",precio:80,img:"https://i.imgur.com/yx6o7ZK.png"},
{nombre:"Clavos",precio:25,img:"https://i.imgur.com/7bKQ9yG.png"}
]
},
{
nombre:"Papelería Escolar Plus",
direccion:"Calle 80 x 150",
imagen:"https://images.unsplash.com/photo-1588072432836-e10032774350",
telefono:"9995131376",
activo:true,
destacado:false,
productos:[
{nombre:"Colores",precio:50,img:"https://i.imgur.com/BoN9kdC.png"},
{nombre:"Goma",precio:12,img:"https://i.imgur.com/kdXkV6x.png"}
]
},
{
nombre:"Mini Súper San José",
direccion:"Calle 70 x 140",
imagen:"https://images.unsplash.com/photo-1542838132-92c53300491e",
telefono:"9995131376",
activo:true,
destacado:false,
productos:[
{nombre:"Leche",precio:30,img:"https://i.imgur.com/8Km9tLL.jpg"},
{nombre:"Pan blanco",precio:28,img:"https://i.imgur.com/UPrs1EW.jpg"}
]
}
];

let carrito={},negocioActual=null;

/* HOME */
function renderHome(){
let cont=document.getElementById("home");
cont.innerHTML="";

negocios.sort((a,b)=>b.destacado-a.destacado);

negocios.forEach((n,i)=>{
if(!n.activo)return;

cont.innerHTML+=`
<div class="card" onclick="verMenu(${i})">
${n.destacado?'<div class="badge">⭐</div>':''}
<div>
<h3>${n.nombre}</h3>
<p>${n.direccion}</p>
</div>
<img src="${n.imagen}">
</div>`;
});
}

/* MENU */
function verMenu(i){
negocioActual=negocios[i];
carrito={};

home.style.display="none";
menu.style.display="block";
titulo.innerText=negocioActual.nombre;

menu.innerHTML=`<button onclick="volver()">⬅ Volver</button>`;

negocioActual.productos.forEach((p,i)=>{
menu.innerHTML+=`
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

/* ADMIN */
function login(){
if(pass.value==="1234"){
form.style.display="block";
}else alert("Contraseña incorrecta");
}

/* AGREGAR NEGOCIO */
function agregarNegocio(){

let nuevo = {
nombre:nNombre.value,
direccion:nDireccion.value,
imagen:nImagen.value,
telefono:nTelefono.value,
activo:true,
destacado:false,
productos:[
{
nombre:pNombre.value,
precio:Number(pPrecio.value),
img:pImg.value
}
]
};

negocios.push(nuevo);

alert("Negocio agregado");

renderHome();
}
