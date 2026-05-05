let envio = 30;

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
}
];

let carrito={},negocioActual=null;

/* ================= FIREBASE ================= */

async function guardarDatos(){
    const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    await setDoc(doc(window.db, "app", "negocios"), {
        data: negocios
    });
}

async function cargarDatos(){
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    const ref = doc(window.db, "app", "negocios");
    const snap = await getDoc(ref);

    if(snap.exists()){
        negocios = snap.data().data;
        renderHome();
    }
}

/* ================= UI ================= */

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

function verMenu(i){
    negocioActual=negocios[i];
    carrito={};

    document.getElementById("home").style.display="none";
    document.getElementById("menu").style.display="block";
    document.getElementById("titulo").innerText=negocioActual.nombre;

    let m=document.getElementById("menu");
    m.innerHTML=`<button onclick="volver()">⬅ Volver</button>`;

    negocioActual.productos.forEach((p,i)=>{
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

function cambiar(i,d){
    let prod=negocioActual.productos[i];
    let k=prod.nombre;

    carrito[k]=(carrito[k]||0)+d;
    if(carrito[k]<=0)delete carrito[k];

    document.getElementById("q"+i).innerText=carrito[k]||0;
}

function toggleCart(){
    document.getElementById("cart").classList.toggle("active");
}

/* ================= PEDIDO ================= */

function enviarPedido(){
    let dir=document.getElementById("direccion").value;
    if(!dir)return alert("Pon dirección");

    let msg=`🧾 Pedido\n🏪 ${negocioActual.nombre}\n📍 ${negocioActual.direccion}\n\n`;

    let total=0;

    for(let k in carrito){
        let p=negocioActual.productos.find(x=>x.nombre==k);
        let cant=carrito[k];
        let subtotal=p.precio*cant;

        msg+=`${k} x${cant} = $${subtotal}\n`;
        total+=subtotal;
    }

    msg+=`\nEnvío: $${envio}`;
    total+=envio;

    msg+=`\nTotal: $${total}\n📍 ${dir}`;

    window.open(`https://wa.me/52${negocioActual.telefono}?text=${encodeURIComponent(msg)}`);
}

function volver(){
    document.getElementById("home").style.display="block";
    document.getElementById("menu").style.display="none";
    document.getElementById("titulo").innerText="Pedidos CD Caucel";
}

/* ================= ADMIN ================= */

function login(){
    let pass=document.getElementById("pass").value;

    if(pass==="1234"){
        let panel=document.getElementById("admin-panel");
        panel.innerHTML="<h4>Admin</h4>";

        negocios.forEach((n,i)=>{
            panel.innerHTML+=`
            <div>
            ${n.nombre}
            <button onclick="toggleDestacado(${i})">
            ${n.destacado?"⭐":"☆"}
            </button>
            </div>`;
        });
    }
}

function toggleDestacado(i){
    negocios[i].destacado=!negocios[i].destacado;
    guardarDatos();
    renderHome();
    login();
}

/* ================= INICIO ================= */

renderHome();
cargarDatos();
