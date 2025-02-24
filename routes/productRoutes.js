const express = require('express')
const { showProducts, showProductById, showNewProduct, createProduct, showEditProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const verifyFirebaseToken = require('../middlewares (BONUS)/verifyFirebaseToken')

const router = express.Router()

router.get('/products', showProducts)
router.get('/products/:productId', showProductById)

router.get('/dashboard/new', verifyFirebaseToken, showNewProduct)
router.post('/dashboard', verifyFirebaseToken, createProduct)
router.get('/dashboard/:productId/edit', verifyFirebaseToken, showEditProduct)
router.put('/dashboard/:productId', verifyFirebaseToken, updateProduct)
router.delete('/dashboard/:productId/delete', verifyFirebaseToken, deleteProduct)


module.exports = router