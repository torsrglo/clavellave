const mysql = require('mysql2')

const mysqlConnect = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'Elpoderoso123#',
    database: 'inmuebles',
    multipleStatements: true,
    insecureAuth: true  // Añade esta línea
});

mysqlConnect.connect(function(err){
    if(err){
      console.error(err);
    }else{
        console.log('Database is connect...')
    }
});

module.exports = mysqlConnect;