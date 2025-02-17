

const express = require('express');
const db = require('./database');
const app = express();

app.use(express.json());

// Ruta para obtener todos los ítems
app.get('/items', (req, res) => {
    const query = `SELECT * FROM items`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Ruta para obtener un ítem específico por su ID
app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM items WHERE id = ?`;

    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }
        res.json(row); 
    });
});

// Ruta para actualizar un ítem
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { 
        titulo, descripcion, imagen, franquicia, genero, autor, anio, 
        disponible, idioma, calidad 
    } = req.body;

    // Validación básica
    if (!titulo || !franquicia || !genero) {
        return res.status(400).json({ error: 'Título, franquicia y género son obligatorios' });
    }

    const idiomaStr = Array.isArray(idioma) ? idioma.join(',') : idioma;
    const calidadStr = Array.isArray(calidad) ? calidad.join(',') : calidad;

    const query = `UPDATE items SET 
                    titulo = ?, descripcion = ?, imagen = ?, franquicia = ?, genero = ?, 
                    autor = ?, anio = ?, disponible = ?, idioma = ?, calidad = ? 
                    WHERE id = ?`;
    const values = [titulo, descripcion, imagen, franquicia, genero, autor, anio, disponible, idiomaStr, calidadStr, id];

    db.run(query, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }
        res.json({ message: 'Ítem actualizado con éxito', id });
    });
});

// Ruta para eliminar un ítem por su ID
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM items WHERE id = ?`;

    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }
        res.json({ message: 'Ítem eliminado con éxito', id });
    });
});



app.get('/', (req, res) => {
    res.send('Backend funcionando 🚀');
});

app.get('/test', (req, res) => {
    res.send('¡La ruta está funcionando!');
});


app.post('/items', (req, res) => {
    const { 
        titulo, descripcion, imagen, franquicia, genero, autor, anio, 
        disponible, idioma, calidad 
    } = req.body;

    // Validación básica
    if (!titulo || !franquicia || !genero) {
        return res.status(400).json({ error: 'Título, franquicia y género son obligatorios' });
    }

    // Convertir "idioma" y "calidad" en cadenas separadas por comas si son arrays
    const idiomaStr = Array.isArray(idioma) ? idioma.join(',') : idioma;
    const calidadStr = Array.isArray(calidad) ? calidad.join(',') : calidad;

    const query = `INSERT INTO items (titulo, descripcion, imagen, franquicia, genero, autor, anio, disponible, idioma, calidad) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [titulo, descripcion, imagen, franquicia, genero, autor, anio, disponible, idiomaStr, calidadStr];

    db.run(query, values, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, titulo, descripcion, imagen, franquicia, genero, autor, anio, disponible, idioma: idiomaStr, calidad: calidadStr });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
