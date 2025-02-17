const sqlite3 = require('sqlite3').verbose();

// Conectar a la base de datos (o crearla si no existe)
const db = new sqlite3.Database(__dirname + '/database.db', (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});



// Crear tabla para los ítems (cómics y películas)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descripcion TEXT,
        imagen TEXT, 
        franquicia TEXT,
        genero TEXT,
        autor TEXT,
        anio INTEGER,
        disponible BOOLEAN,  
        idioma TEXT,         
        calidad TEXT        
    )`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err);
        } else {
            console.log('Tabla "items" creada o ya existe');
        }
    });

    // Verificar si la tabla "items" existe
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='items'", (err, row) => {
        if (err) {
            console.error('Error al verificar la tabla:', err);
        } else if (!row) {
            console.log('La tabla "items" no existe');
        } else {
            console.log('La tabla "items" existe');
        }
    });
});

module.exports = db;
