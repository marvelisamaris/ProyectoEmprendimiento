const mongoose = require('mongoose');

const { Schema } = mongoose;

const inventario = new Schema({
    cod: Number,
    name_list: String,
    price: Number,
    cant: Number,
    descr: String,
});

module.exports = mongoose.model('factura', inventario);