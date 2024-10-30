const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const xlsx = require('xlsx');

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdsdmaUQIDb-eQ3BPHmfw1g7aE8ycBays",
    authDomain: "regglit.firebaseapp.com",
    projectId: "regglit",
    storageBucket: "regglit.appspot.com",
    messagingSenderId: "1057680733970",
    appId: "1:1057680733970:web:f5276401c6ea579702e5cb",
    measurementId: "G-YZ621ZFQJG"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cargar el archivo Excel
const workbook = xlsx.readFile('HISTORICO REGLAS.xlsx');
const sheet = workbook.Sheets['Hoja1'];
const data = xlsx.utils.sheet_to_json(sheet);

// Función para subir cada registro a Firebase
data.forEach(async (record) => {
  try {
    // Verificar y convertir la fecha correctamente
    const excelDate = record.Fecha;
    let formattedDate;

    if (typeof excelDate === 'number') {
      // Si la fecha está en formato numérico (fecha de Excel), conviértela a un objeto Date
      formattedDate = new Date((excelDate - (25567 + 2)) * 86400 * 1000); // Ajuste para la época de Excel
    } else if (typeof excelDate === 'string' || excelDate instanceof Date) {
      // Si la fecha ya es una cadena o un objeto Date, intenta convertirla directamente
      formattedDate = new Date(excelDate);
    }

    if (isNaN(formattedDate)) {
      console.error(`Invalid date for record: ${record}`);
      return;
    }

    // Verificar si el campo Duración está presente y es un número
    const duration = record.Duración || 4; // Usa 4 días como valor por defecto si no está presente

    // Subir el documento a Firestore
    await addDoc(collection(db, 'cycles'), {
      date: formattedDate.toISOString().split('T')[0], // Convertir a formato ISO sin hora
      event: record.Evento,
      duration: duration // Agregar duración al registro
    });
    console.log(`Uploaded: ${formattedDate.toISOString().split('T')[0]}, Duración: ${duration} días`);
  } catch (error) {
    console.error("Error uploading document:", error);
  }
});
