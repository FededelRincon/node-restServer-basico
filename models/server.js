const express = require('express');
const cors = require('cors');


class Server {

    constructor(){
        this.app = express();   //creo el servidor como una propiedad
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();  //esto para llamar las routes ni bien se instancie la clase
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Direcorio publico
        this.app.use( express.static('public') );

    }

    routes() {
        
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    
        //si quisiera mas rutas
        // this.app.use(this.usuariosPath, require('../routes/usuarios'));
        // this.app.use(this.usuariosPath, require('../routes/usuarios'));
        //lo usamos como middleware
    }

    listen(){
        this.app.listen( this.port, () => {
          console.log(`restServer listening at http://localhost:${ this.port }`);
        })
    }
}

module.exports = Server;