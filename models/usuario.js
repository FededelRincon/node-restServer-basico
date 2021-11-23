

const{ Schema, model} = require ('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {  //el rol permitido es uno de esos 2 de la lista
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: { //usuario activo, x defecto es true
        type: Boolean,
        default: true
    },
    google: {   //es user fue creado x google sign in
        type: Boolean,
        default: false
    }
});


UsuarioSchema.methods.toJSON = function() { //tiene q ser funcion normal, xq uso el this
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}


module.exports = model( 'Usuario', UsuarioSchema ); //siempre en singular