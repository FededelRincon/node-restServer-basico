const Role = require('../models/role');
const Usuario = require('../models/usuario');


const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`) //error personalizado
    }
    
}

const emailExiste = async ( correo = '' ) => {
    const existeEmail = await  Usuario.findOne({ correo })
    if ( existeEmail ) {
        throw new Error(`El correo: ${correo} ya esta registrado en la BD`) //error personalizado
    }
}


const existeUsuarioPorId = async ( id = '' ) => {
    const existeUsuario = await  Usuario.findById( id );
    if ( !existeUsuario ) { //si el usuario existe lo deja pasar, si no existe tira el error
        throw new Error(`El id: ${ id } no existe en la BD`) //error personalizado
    }
}


    


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
}