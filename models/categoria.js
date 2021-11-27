const { Schema, model } = require('mongoose');


const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre de la categoria es obligatoria'],
        unique: true,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }

});


CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, password, ...data } = this.toObject();
    //la idea de esto es q no salgan cosas en la respuesta
    return data;
}



module.exports = model( 'Categoria', CategoriaSchema );
