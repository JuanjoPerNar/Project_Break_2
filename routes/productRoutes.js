const express = require('express')
const { showProducts, showProductById, showNewProduct, createProduct, showEditProduct, updateProduct, deleteProduct } = require('../controllers/productController')

const router = express.Router()

router.get('/products', showProducts)
router.get('/products/:productId', showProductById)

router.get('/dashboard/new', showNewProduct)
router.post('/dashboard', createProduct)
router.get('/dashboard/:productId/edit', showEditProduct)
router.put('/dashboard/:productId', updateProduct)
router.delete('/dashboard/:productId/delete', deleteProduct)


module.exports = router