const mongoose = require('mongoose');

const { Schema } = mongoose;

const RegistroVentas = new Schema({
    codigo: Number,
    nombre: String,
    precio: precio,
    cantidad: Number,
    descrip: String,
    tipoVentas: String
});

module.exports = mongoose.model('ventas', RegistroVentas);

