const mongoose = require('mongoose');

const { Schema } = mongoose;

const RegistroSucursal = new Schema({
    nombre: String,
    direccion: String,
    telefono: Number,
    correo: String,
    estado: String,
    
    tipoCliente: String
});

module.exports = mongoose.model('sucursal', RegistroSucursal);