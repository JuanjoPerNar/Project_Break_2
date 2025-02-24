const express = require('express')
const dotenv = require('dotenv')
const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const methodOverride = require('method-override')
const productRoutes = require('../routes/productRoutes')
const authRoutes = require('../routes/authRoutes')
const Product = require('../models/Products')

dotenv.config()

let mongoServer

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use('/', authRoutes)
app.use('/', productRoutes)

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

beforeEach(async () => {
  await Product.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongoServer.stop()
})

describe('Authentication endpoints', () => {
  describe('GET /login', () => {
    it('should return the login view HTML content', async () => {
      const res = await request(app).get('/login')
      expect(res.status).toBe(200)
      expect(res.text).toContain('<!DOCTYPE html>')
      expect(res.text).toContain('Iniciar Sesión')
    })
  })

  describe('GET /register', () => {
    it('should return the register view HTML content', async () => {
      const res = await request(app).get('/register')
      expect(res.status).toBe(200)
      expect(res.text).toContain('<!DOCTYPE html>')
      expect(res.text).toContain('Registro')
    })
  })

  describe('POST /login', () => {
    it('should return an error message', async () => {
      const res = await request(app)
        .post('/login')
        .send({ email: 'testlogin@ejemplo.com', password: '123456' })
      expect(res.status).toBe(400)
      expect(res.text).toContain("El login debe realizarse a través del cliente con Firebase Auth")
    })
  })

  describe('POST /register', () => {
    it('should return an error message', async () => {
      const res = await request(app)
        .post('/register')
        .send({ name: 'Test', email: 'testregister@ejemplo.com', password: '123456' })
      expect(res.status).toBe(400)
      expect(res.text).toContain("El registro debe realizarse a través del cliente con Firebase Auth")
    })
  })

  describe('GET /logout', () => {
    it('should redirect to /login', async () => {
      const res = await request(app).get('/logout')
      expect(res.status).toBe(302)
      expect(res.headers.location).toBe('/login')
    })
  })
})

describe('Product endpoints', () => {
  describe('GET /products', () => {
    it('should return all products in HTML format with status 200', async () => {
      const res = await request(app).get('/products')
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toMatch(/html/)
      expect(res.text).toMatch(/<html/)
    })
  })

  describe('POST /dashboard', () => {
    it('should create a new product and redirect to /products', async () => {
      const productData = {
        name: 'Camiseta',
        description: 'Camiseta de prueba',
        image: 'http://camisetadepreuba.com/image.jpg',
        category: 'Camisetas',
        size: 'M',
        price: 25
      }
      const res = await request(app).post('/dashboard').send(productData)
      expect(res.status).toBe(302)
      expect(res.headers.location).toBe('/products')

      const product = await Product.findOne({ name: 'Camiseta' })
      expect(product).not.toBeNull()
      expect(product.description).toBe('Camiseta de prueba')
    })
  })

  describe('GET /products/:productId', () => {
    it('should return product details in HTML format with status 200', async () => {
      const newProduct = new Product({
        name: 'Zapato',
        description: 'Zapato de prueba',
        image: 'http://zapatodeprueba.com/image.jpg',
        category: 'Zapatos',
        size: '40',
        price: 50
      })
      await newProduct.save()

      const res = await request(app).get(`/products/${newProduct._id}`)
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toMatch(/html/)
      expect(res.text).toContain('Zapato de prueba')
    })
  })

  describe('PUT /dashboard/:productId', () => {
    it('should update a product and redirect to its detail page', async () => {
      const newProduct = new Product({
        name: 'Zapato',
        description: 'Zapato de prueba',
        image: 'http://zapatodeprueba.com/image.jpg',
        category: 'Zapatos',
        size: '40',
        price: 50
      })
      await newProduct.save()

      const updateData = {
        name: 'Zapato Actualizado',
        description: 'Zapato de prueba actualizado',
        image: 'http://zapatodeprueba.com/updated.jpg',
        category: 'Zapatos',
        size: '40',
        price: 48
      }

      const res = await request(app).put(`/dashboard/${newProduct._id}`).send(updateData)
      expect(res.status).toBe(302)
      expect(res.headers.location).toBe(`/products/${newProduct._id}`)

      const updatedProduct = await Product.findById(newProduct._id)
      expect(updatedProduct.name).toBe('Zapato Actualizado')
      expect(updatedProduct.description).toBe('Zapato de prueba actualizado')
      expect(updatedProduct.price).toBe(48)
    })
  })

  describe('DELETE /dashboard/:productId/delete', () => {
    it('should delete a product and redirect to /products', async () => {
      const newProduct = new Product({
        name: 'Zapato',
        description: 'Zapato de prueba',
        image: 'http://zapatodeprueba.com/image.jpg',
        category: 'Zapatos',
        size: '40',
        price: 50
      })
      await newProduct.save()
      
      const res = await request(app).delete(`/dashboard/${newProduct._id}/delete`)
      expect(res.status).toBe(302)
      expect(res.headers.location).toBe('/products')

      const found = await Product.findById(newProduct._id)
      expect(found).toBeNull()
    })
  })
})
