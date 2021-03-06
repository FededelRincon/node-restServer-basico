const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');


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

/**
 * Categorias
 */
const existeCategoriaPorId = async ( id = '' ) => {
    const existeCategoria = await  Categoria.findById( id );
    if ( !existeCategoria ) { 
        throw new Error(`El id: ${ id } no existe en la BD`) //error personalizado
    }
}

/**
 * Productos
 */
const existeProductoPorId = async ( id = '' ) => {
    const existeProducto = await Producto.findById( id );
    if ( !existeProducto ) { 
        throw new Error(`El id: ${ id } no existe en la BD`) //error personalizado
    }
}


/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida. Las permitidas son ${colecciones}`)
    }

    return true;
}
    


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas,
}