// Importa los módulos de Firebase necesarios
import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc, getDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2XTrUWKtWd_Pn3_8MJ5uZ7ysSO72ytdI",
    authDomain: "pedidos-locales.firebaseapp.com",
    projectId: "pedidos-locales",
    storageBucket: "pedidos-locales.firebasestorage.app",
    messagingSenderId: "1069589244691",
    appId: "1:1069589244691:web:a8f8da4f9091001736c8e6",
    measurementId: "G-66K80G5RQC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializar Firestore

let negocios = [
    {
        nombre: "Tienda La Esquina",
        direccion: "Calle 45 x 120",
        imagen: "https://images.unsplash.com/photo-1604719312566-8912e9c8a213",
        telefono: "9995131376",
        activo: true,
        destacado: false,
        productos: [
            { nombre: "Coca Cola", precio: 20, img: "https://i.imgur.com/8Km9tLL.jpg" },
            { nombre: "Pan dulce", precio: 10, img: "https://i.imgur.com/UPrs1EW.jpg" }
        ]
    },
    // Otros negocios...
];

// Función para guardar los negocios destacados en Firestore
async function guardarDestacados() {
    const destacados = negocios.filter(n => n.destacado);
    try {
        // Guardar en Firestore
        await setDoc(doc(db, "negocios", "destacados"), {
            negociosDestacados: destacados
        });
        console.log("Destacados guardados correctamente en Firestore");
    } catch (e) {
        console.error("Error al guardar destacados en Firestore: ", e);
    }
}

// Función para cargar los negocios destacados desde Firestore
async function cargarDestacados() {
    try {
        const docRef = doc(db, "negocios", "destacados");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const negociosGuardados = docSnap.data().negociosDestacados;
            if (negociosGuardados) {
                negociosGuardados.forEach(negocioGuardado => {
                    const negocio = negocios.find(n => n.nombre === negocioGuardado.nombre);
                    if (negocio) {
                        negocio.destacado = true;
                    }
                });
            }
        } else {
            console.log("No se encontraron negocios destacados en Firestore");
        }
    } catch (e) {
        console.error("Error al cargar destacados desde Firestore: ", e);
    }
}

// Función para renderizar la página de inicio
function renderHome() {
    let cont = document.getElementById("home");
    cont.innerHTML = "";

    let ordenados = [...negocios].sort((a, b) => b.destacado - a.destacado);

    ordenados.forEach(n => {
        if (!n.activo) return;
        let i = negocios.indexOf(n);

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

// Función para manejar el cambio de estado "destacado"
function toggleDestacado(i) {
    negocios[i].destacado = !negocios[i].destacado;
    renderHome();
    guardarDestacados(); // Guardar los negocios destacados en Firestore
    login();
}

// Cargar los negocios destacados desde Firestore al iniciar
cargarDestacados();
renderHome();
