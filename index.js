const express = require('express');
const app = express();
const pool = require('./db');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM productos ORDER BY id');
  res.render('lista', { productos: result.rows });
});


app.get('/crear', (req, res) => {
  res.render('crear');
});

app.post('/crear', async (req, res) => {
  const { nombre, descripcion, stock } = req.body;
  await pool.query('INSERT INTO productos(nombre, descripcion, stock) VALUES($1, $2, $3)', [nombre, descripcion, stock]);
  res.redirect('/');
});


app.get('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
  res.render('editar', { producto: result.rows[0] });
});

app.post('/editar/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, stock } = req.body;
  await pool.query('UPDATE productos SET nombre = $1, descripcion = $2, stock = $3 WHERE id = $4', [nombre, descripcion, stock, id]);
  res.redirect('/');
});


app.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM productos WHERE id = $1', [id]);
  res.redirect('/');
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
