const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {
    return new Promise( (resolve, reject) => {

        const { archivo } = files;  //extraigo el archivo q me mandar, y se q esta xq lo chequee arriba
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length -1 ]; //me quedo con la extension del archivo
    
        // Validar la extension
        if ( !extensionesValidas.includes(extension) ){
            return reject( `La extension '${extension}' no es permitida. Las permitidas son: ${ extensionesValidas }` );
        }
    
        const nombreTemporal = uuidv4() + '.' + extension;
        const uploadPath = path .join( __dirname, '../uploads/', carpeta, nombreTemporal);   //creo la ruta donde se va a grabar ese file
      
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err)
            }
      
            resolve( nombreTemporal );
        });
    });






}

module.exports = {
    subirArchivo
}
