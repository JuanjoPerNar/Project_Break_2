const express = require('express')
const { showProducts, showProductById, showNewProduct, createProduct, showEditProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const verifyFirebaseToken = require('../middlewares (BONUS)/verifyFirebaseToken')
const verifyAdmin = require('../middlewares (BONUS)/verifyAdmin')

const router = express.Router()

router.get('/products', showProducts)
router.get('/products/:productId', showProductById)

router.get('/dashboard/new', verifyFirebaseToken, verifyAdmin, showNewProduct)
router.post('/dashboard', verifyFirebaseToken, verifyAdmin, createProduct)
router.get('/dashboard/:productId/edit', verifyFirebaseToken, verifyAdmin, showEditProduct)
router.put('/dashboard/:productId', verifyFirebaseToken, verifyAdmin, updateProduct)
router.delete('/dashboard/:productId/delete', verifyFirebaseToken, verifyAdmin, deleteProduct)


module.exports = router