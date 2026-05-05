let negocios = [
{
nombre:"Tienda La Esquina",
direccion:"Calle 45 x 120",
activo:true,
destacado:false
},
{
nombre:"Papelería Lupita",
direccion:"Calle 60 x 115",
activo:true,
destacado:false
}
];

/* =========================
   🔥 CARGAR DESDE FIREBASE
========================= */
async function cargarDatos(){
    try{
        const ref = window.fb.doc(window.db, "app", "negocios");
        const snap = await window.fb.getDoc(ref);

        if(snap.exists()){
            negocios = snap.data().data;
            console.log("Datos cargados ✔");
        } else {
            console.log("No hay datos aún en Firebase");
        }

        renderHome(); // 👈 IMPORTANTE: aquí, después de cargar

    }catch(e){
        console.error("Error Firebase:", e);
        renderHome();
    }
}

/* =========================
   🔥 GUARDAR
========================= */
async function guardarDatos(){
    const ref = window.fb.doc(window.db, "app", "negocios");

    await window.fb.setDoc(ref, {
        data: negocios
    });

    console.log("Guardado en nube ✔");
}

/* =========================
   UI
========================= */
function renderHome(){
    let cont=document.getElementById("home");
    cont.innerHTML="";

    let ordenados=[...negocios].sort((a,b)=>b.destacado-a.destacado);

    ordenados.forEach((n,i)=>{
        if(!n.activo)return;

        cont.innerHTML+=`
        <div class="card">
        <div>
        <b>${n.nombre}</b><br>
        ${n.direccion}
        ${n.destacado?'<div class="badge">⭐</div>':''}
        </div>
        </div>`;
    });
}

/* =========================
   ADMIN
========================= */
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

    guardarDatos(); // 👈 GUARDA EN NUBE
    renderHome();
    login();
}

/* =========================
   INICIO CORRECTO
========================= */
cargarDatos();
