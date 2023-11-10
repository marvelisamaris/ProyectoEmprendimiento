const mongoose = require('mongoose');

const { Schema } = mongoose;

const RegistroClientes = new Schema({
    cedula: Number,
    nombre: String,
    apellidos: String,
    telefono: Number,
    correo: String,
    direccion: String,
    tipoCliente: String
});

module.exports = mongoose.model('clientes', RegistroClientes);