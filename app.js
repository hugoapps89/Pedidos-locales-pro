/* =========================
   DATOS INICIALES
========================= */
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
},
{
nombre:"Mini Súper San José",
direccion:"Calle 70 x 140",
activo:true,
destacado:false
}
];

/* =========================
   CARGAR DESDE FIREBASE
========================= */
async function cargarDatos(){
    try{
        const ref = window.fb.doc(window.db, "app", "negocios");
        const snap = await window.fb.getDoc(ref);

        if(snap.exists()){
            negocios = snap.data().data;
            console.log("Datos cargados ✔");
        }else{
            console.log("No hay datos en Firebase aún");
        }

        renderHome();

    }catch(e){
        console.error("Error cargando:", e);
        renderHome();
    }
}

/* =========================
   GUARDAR EN FIREBASE
========================= */
async function guardarDatos(){
    try{
        const ref = window.fb.doc(window.db, "app", "negocios");

        await window.fb.setDoc(ref, {
            data: negocios
        });

        console.log("Guardado en nube ✔");

    }catch(e){
        console.error("Error guardando:", e);
    }
}

/* =========================
   UI
========================= */
function renderHome(){
    let cont = document.getElementById("home");
    cont.innerHTML = "";

    let ordenados = [...negocios].sort((a,b)=>b.destacado - a.destacado);

    ordenados.forEach((n,i)=>{
        if(!n.activo) return;

        cont.innerHTML += `
        <div class="card">
            <div>
                <b>${n.nombre}</b><br>
                ${n.direccion}
                ${n.destacado ? '<div class="badge">⭐ Destacado</div>' : ''}
            </div>
        </div>`;
    });
}

/* =========================
   ADMIN
========================= */
function login(){
    let pass = document.getElementById("pass").value;

    if(pass === "1234"){
        let panel = document.getElementById("admin-panel");
        panel.innerHTML = "<h4>Negocios</h4>";

        negocios.forEach((n,i)=>{
            panel.innerHTML += `
            <div>
                ${n.nombre}
                <button onclick="toggleDestacado(${i})">
                    ${n.destacado ? "⭐" : "☆"}
                </button>
            </div>`;
        });
    } else {
        alert("Contraseña incorrecta");
    }
}

function toggleDestacado(i){
    negocios[i].destacado = !negocios[i].destacado;

    guardarDatos(); // 🔥 guarda en nube
    renderHome();
    login();
}

/* =========================
   INICIO
========================= */
cargarDatos();
