const mongoose = require('mongoose');

const { Schema } = mongoose;

const RegistroProveedor = new Schema({
    proveedor: String,
    nit: Number,
    direccion: String,
    contacto: String,
    telefono: Number,
    correo: String,
    tipoProveedor: String
});

module.exports = mongoose.model('prov', RegistroProveedor);