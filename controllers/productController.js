const Product = require('../models/Products')

const baseHtml = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tienda de Ropa</title>
    <link rel="stylesheet" href="/views/styles.css">
</head>
<body>
    ${content}
    <script type="module" src="/utils/firebase.js"></script>
</body>
</html>
`
const getNavBar = () => `
<header>
  <nav>
    <ul>
      <li><a href="/products">Todos</a></li>
      <li><a href="/products?category=Camisetas">Camisetas</a></li>
      <li><a href="/products?category=Pantalones">Pantalones</a></li>
      <li><a href="/products?category=Zapatos">Zapatos</a></li>
      <li><a href="/products?category=Accesorios">Accesorios</a></li>
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/logout">Cerrar sesión</a></li>
      <li><a href="/login">Login</a></li>
      <li><a href="/register">Registro</a></li>
    </ul>
  </nav>
</header>
`

const getProductCards = (products) => {
    let html = '<div class="product-container">'
    for (let product of products) {
        html += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>${product.price}€</p>
            <a href="/products/${product._id}" class="btn-style">Ver detalle</a>
        </div>
        `
    }
    html += '</div>'
    return html
}

const showProducts = async (req, res) => {
    try {
        const filter = {}
        if (req.query.category) {
            filter.category = req.query.category
        }
        const products = await Product.find(filter)
        const productCards = getProductCards(products)
        const html = baseHtml(getNavBar() + productCards)
        res.send(html)
    } catch (error) {
        res.status(500).json({ message: 'Error getting products', error})
    }
}

const showProductById = async (req, res) => {
    try {
        const productId = req.params.productId.trim()
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).send(baseHtml('<h1>Producto no encontrado</h1>'))
        }
        const productDetail = `
            <div class="product-detail">
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>${product.price}€</p>
                <a href="/products" class="btn-style">Volver a la tienda</a>
                <a href="/dashboard/${product._id}/edit" class="btn-style">Editar Producto</a>
                <form action="/dashboard/${product._id}/delete?_method=delete" method="post">
                    <button type="submit" class="btn-style">Eliminar Producto</button>
                </form>
            </div>
        `
        const html = baseHtml(getNavBar() + productDetail)
        res.send(html)
    } catch (error) {
        res.status(500).json({ message: 'Error getting product', error })        
    }
}

const showNewProduct = (req, res) => {
    const formHtml = `
        <div class="container">
            <h1>Agregar Nuevo Producto</h1>
            <form action="/dashboard" method="post">
                <label for="name">Nombre:</label>
                <input type="text" name="name" id="name" required placeholder="Nombre del producto">

                <label for="description">Descripción:</label>
                <textarea name="description" id="description" required placeholder="Descripción del producto"></textarea>

                <label for="image">URL de Imagen:</label>
                <input type="text" name="image" id="image" required placeholder="Subir imagen">

                <label for="category">Categoría:</label>
                <select name="category" id="category" required>
                    <option value="Camisetas">Camisetas</option>
                    <option value="Pantalones">Pantalones</option>
                    <option value="Zapatos">Zapatos</option>
                    <option value="Accesorios">Accesorios</option>
                </select>

                <label for="size">Talla:</label>
                <input type="text" name="size" id="size" placeholder="Talla">

                <label for="price">Precio (€):</label>
                <input type="number" name="price" id="price" required placeholder="Precio del producto">

                <button type="submit" class="btn-style">Agregar Producto</button>
            </form>
            <a href="/products" class="btn-style">Volver</a>
        </div>
    `

    const html = baseHtml(getNavBar() + formHtml)
    res.send(html)
}


const createProduct = async (req, res) => {
    try {
        const { name, description, image, category, size, price } = req.body
        if (!name || !description || !image || !category || !price) {
            return res.status(400).send(baseHtml('<h1>Error: Todos los campos obligatorios deben estar llenos.</h1>'))
        }
        const newProduct = new Product({ name, description, image, category, size, price })
        await newProduct.save()

        res.redirect(`/products`)
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error })
    }
}

const showEditProduct = async (req, res) => {
    try {
        const productId = req.params.productId.trim()
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).send(baseHtml('<h1>Producto no encontrado</h1>'))
        }
        const formHtml = `
           <div class="container">
             <h1>Editar Producto</h1>
             <form action="/dashboard/${product._id}?_method=put" method="post">
               <label for="name">Nombre:</label>
               <input type="text" name="name" id="name" value="${product.name}" required placeholder="Nombre del producto">

               <label for="description">Descripción:</label>
               <textarea name="description" id="description" required placeholder="Descripción del producto">${product.description}</textarea>

               <label for="image">URL de Imagen:</label>
               <input type="text" name="image" id="image" value="${product.image}" required placeholder="Subir imagen">

               <label for="category">Categoría:</label>
               <select name="category" id="category" required>
                 <option value="Camisetas" ${product.category === 'Camisetas' ? 'selected' : ''}>Camisetas</option>
                 <option value="Pantalones" ${product.category === 'Pantalones' ? 'selected' : ''}>Pantalones</option>
                 <option value="Zapatos" ${product.category === 'Zapatos' ? 'selected' : ''}>Zapatos</option>
                 <option value="Accesorios" ${product.category === 'Accesorios' ? 'selected' : ''}>Accesorios</option>
               </select>

               <label for="size">Talla:</label>
               <input type="text" name="size" id="size" value="${product.size}" placeholder="Talla del producto">

               <label for="price">Precio (€):</label>
               <input type="number" name="price" id="price" value="${product.price}" required placeholder="Precio del producto">

               <button type="submit" class="btn-style">Actualizar Producto</button>
             </form>
             <a href="/products/${product._id}" class="btn-style">Cancelar</a>
           </div>
    `
        const html = baseHtml(getNavBar() + formHtml)
        res.send(html)
    } catch (error) {
        res.status(500).json({ message: 'Error mostrando el formulario de edición', error })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId.trim()
        const { name, description, image, category, size, price } = req.body
        await Product.findByIdAndUpdate(productId, { name, description, image, category, size, price })
        res.redirect(`/products/${productId}`)
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId.trim()
        await Product.findByIdAndDelete(productId)
        res.redirect('/products')
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error})
    }
}

module.exports = {
    showProducts,
    showProductById,
    showNewProduct,
    createProduct,
    showEditProduct,
    updateProduct,
    deleteProduct
}