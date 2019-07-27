const mongoose = require('mongoose');

// const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categoriaSchema = new Schema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'E necessaria uma categoria']
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    }
});

// categories.plugin(uniqueValidator, {message: '{PATH} deve ser unico'});

module.exports = mongoose.model('Categoria', categoriaSchema);