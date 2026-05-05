let envio = 30;

/* =========================
   DATOS INICIALES
========================= */
let negociosIniciales = [
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

/* =========================
   CARGA SEGURA (CLAVE 🔥)
========================= */
function cargarNegocios(){
    let guardado = localStorage.getItem("negocios");

    if(guardado){
        try{
            return JSON.parse(guardado);
        }catch(e){
            console.error("Error en localStorage, reiniciando...");
            return negociosIniciales;
        }
    }

    return negociosIniciales;
}

let negocios = cargarNegocios();

/* =========================
   GUARDAR
========================= */
function guardarDatos(){
    localStorage.setItem("negocios", JSON.stringify(negocios));
    console.log("Guardado ✔");
}

/* =========================
   VARIABLES
========================= */
let carrito = {}, negocioActual = null;

/* =========================
   HOME
========================= */
function renderHome(){
    let cont = document.getElementById("home");
    cont.innerHTML = "";

    let ordenados = [...negocios].sort((a,b)=>b.destacado - a.destacado);

    ordenados.forEach(n=>{
        if(!n.activo) return;
        let i = negocios.indexOf(n);

        cont.innerHTML += `
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

/* =========================
   ADMIN (CLAVE 🔥)
========================= */
function toggle(i){
    negocios[i].activo = !negocios[i].activo;
    guardarDatos();
    renderHome();
    login();
}

function toggleDestacado(i){
    negocios[i].destacado = !negocios[i].destacado;
    guardarDatos();
    renderHome();
    login();
}

/* =========================
   RESTO IGUAL (resumido)
========================= */
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
    if(carrito[k]<=0) delete carrito[k];

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

        c.innerHTML+=`${k} x${cant} = $${subtotal}<br>`;
    }

    if(count>0){
        total+=envio;
        c.innerHTML+=`Envío = $${envio}<br>`;
    }

    c.innerHTML+=`<b>Total: $${total}</b>`;

    if(count>0){
        fab.style.display="block";
        document.getElementById("total-fab").innerText=total;
    } else fab.style.display="none";
}

function toggleCart(){
    document.getElementById("cart").classList.toggle("active");
}

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

function login(){
    let pass=document.getElementById("pass").value;

    if(pass==="1234"){
        let panel=document.getElementById("admin-panel");
        panel.innerHTML="<h4>Administrar negocios</h4>";

        negocios.forEach((n,i)=>{
            panel.innerHTML+=`
            <div>
            ${n.nombre}
            <button onclick="toggle(${i})">${n.activo?"Activo":"Inactivo"}</button>
            <button onclick="toggleDestacado(${i})">
            ${n.destacado?"⭐":"☆"}
            </button>
            </div>`;
        });
    } else alert("Contraseña incorrecta");
}

renderHome();
