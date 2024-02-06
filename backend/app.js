const express = require('express');
const cors = require('cors');
const multer=require('multer');
const morgan = require('morgan');
const path = require('path');
const mysqlConnect = require('./database');
const fs = require('fs').promises;

const app = express();

//middlewares
app.use(cors({origin:"*"}));
app.use(express.json());
app.use(morgan('dev'));


//rutas
app.get("/imagen", (req, res) => {
    mysqlConnect.query('SELECT * FROM  terrenos', (err, rows, fields) => {
        if (!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});
//ruta para guardar las imagenes
app.use('/imagenes',express.static(path.join(__dirname,'imagenes')));

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
    callback(null,'imagenes')
    },
    filename: (req,file,callback) =>{
        callback(null, file.originalname);
    }
});

const upload = multer({storage});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    deleteFile(id);
    mysqlConnect.query('DELETE FROM terrenos WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error eliminando el inmueble' });
      } else {
        res.json({ message: 'El inmueble fue eliminado' });
      }
    });
  });
  

  function deleteFile(id) {
    mysqlConnect.query('SELECT * FROM terrenos WHERE id = ?', [id], (err, rows, fields) => {
      if (err) {
        console.error(err);
      } else {
        const [{ imagen }] = rows;
        fs.unlink(path.resolve('./' + imagen)).then(() => {
          console.log('Imagen eliminada');
        }).catch(err => {
          console.error(err);
        });
      }
    });
  }
  

//puerto de conexion
app.listen(3000, () =>{
    console.log('Server funcionando en el puerto 3000')
});



app.post('/file',upload.single('file'),(req,res,next)=>{
    const file = req.file;

    const terrenos = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        ubicacion: req.body.ubicacion,
        metraje: req.body.metraje,
        tipo_venta: req.body.tipo_venta,
        tipo_inmueble: req.body.tipo_inmueble,
        imagen: file.path,
        fecha_registro: new Date()
      };

    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400;
        return next(error)
    }

    res.send(file);
    console.log(terrenos);

   mysqlConnect.query('INSERT INTO terrenos set ?', [terrenos]);
})