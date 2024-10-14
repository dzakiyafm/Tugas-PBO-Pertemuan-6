// memanggil library yang sudah diinstall sebelumnya di terminal.
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// memanggil atau menjalankan fungsi dari library express.
// menggunakan bodyparser untuk memparsing informasi yang ada dalam url
const app = express();
app.use(bodyParser.urlencoded({extended : false})); //urlencoded itu untuk mengambil data url seperti www, dsb.
app.use(bodyParser.json()); //json digunakan untuk pertukaran data.

// membuat koneksi MySQL, sesuaikan isinya seperti XAMPP
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pbo_pertemuan6'
});

// untuk melihat datanya dapat berjalan atau tidak
connection.connect((err) =>{
    if(err){
        console.error("Terjadi kesalahan dalam koneksi ke MySQL:", err.stack);
        return;
    }
    console.log("Koneksi MySQL BERHASIL dengan id" + connection.threadId)
});

// digunakan untuk routing, yaitu memberikan informasi kemana rute dari app.js akan membuka filenya.
// macam-macam routing: create, read, update, dan delete.
app.set('view engine', 'ejs');

// get digunakan untuk mengambil data
// READ
app.get('/', (req, res) =>{
    const query = 'SELECT * FROM anggota'; 
    connection.query(query, (err, results) =>{
        res.render('index', {anggota: results});
    });
}); //untuk menampilkan data pada halaman index.

// CREATE atau INPUT
app.post('/add', (req, res) =>{
    const { name, instagram, grup } = req.body;
    const query = 'INSERT INTO anggota (name, instagram, grup) VALUES (?, ?, ?)';
    connection.query(query, [name, instagram, grup], (err, results) =>{
        if(err) throw err;
        res.redirect('/');
    });
});

// UPDATE
// untuk akses halaman
app.get('/edit/:id', (req, res) => {
    const query = 'SELECT * FROM anggota WHERE id = ?'; 
    connection.query(query, [req.params.id], (err, result) =>{
        if(err) throw err;
        res.render('edit', {anggota: result[0]});
    });
});

// untuk update data
app.post('/update/:id', (req, res) =>{
    const { name, instagram, grup } = req.body;
    const query = 'UPDATE anggota SET name = ?, instagram = ?, grup = ? WHERE id = ?';
    connection.query(query, [name, instagram, grup, req.params.id], (err, results) =>{
        if(err) throw err;
        res.redirect('/');
    });
});

// DELETE
app.get('/delete/:id', (req, res) => {
    const query = 'DELETE FROM anggota WHERE id = ?'; 
    connection.query(query, [req.params.id], (err, result) =>{
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(127,()=>{
    console.log("Server berjalan di port 3000, buka web melalui http://localhost:127")
});