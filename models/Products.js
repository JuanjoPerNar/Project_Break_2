const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Camisetas', 'Pantalones', 'Zapatos', 'Accesorios'],
        required: true
    },
    size: {
        type: String,
        required: function () {
            return this.category !== 'Accesorios'
        },
        validate: {
            validator: function (value) {
                if (this.category === 'Zapatos') {
                    return ['37', '38', '39', '40', '41', '42', '43', '44'].includes(value)
                } else if (this.category === 'Camisetas' || this.category === 'Pantalones') {
                    return ['XS', 'S', 'M', 'L', 'XL'].includes(value)
                } else {
                    return true
                }
            }
        },
        message: props => `La talla no es válida para esta categoría`
    },
    price: {
        type: Number,
        required: true
    },
},
{ timestamps: true }
)

const Product = mongoose.model('Product', productSchema)

module.exports = Product