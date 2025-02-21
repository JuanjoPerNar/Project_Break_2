const express = require('express')
const dotenv = require('dotenv')
const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const methodOverride = require('method-override')
const routes = require('../routes/productRoutes')
const Product = require('../models/Products')

let mongoServer

dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.use('/', routes)

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

describe('tests for product controller using Mongo Memory Server', () => {
    describe('GET /products', () => {
        it('Should return all products in HTML format with status 200', async () => {
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
                image: 'http://camiseta.com/image.jpg',
                category: 'Camisetas',
                size: 'M',
                price: 25
            }
            const res = await request(app).post('/dashboard').send(productData)
            expect(res.status).toBe(302)
            expect(res.headers.location).toBe('/products')
    
            const product = await Product.findOne({ name: 'Camiseta'})
            expect(product).not.toBeNull()
            expect(product.description).toBe('Camiseta de prueba')
        })
    })

    describe('GET /products/:productId', () => {
        it('should return product details in HTML format with status 200', async () => {
            const newProduct = new Product({
                name: 'Zapato',
                description: 'Zapato de prueba',
                image: 'http://zapato.com/image.jpg',
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
                image: 'http://zapato.com/image.jpg',
                category: 'Zapatos',
                size: '40',
                price: 50
            })
            await newProduct.save()

            const updateData = {
                name: 'Zapato',
                description: 'Zapato de prueba',
                image: 'http://zapato.com/image.jpg',
                category: 'Zapatos',
                size: '40',
                price: 48
            }
            const res = await request(app).put(`/dashboard/${newProduct._id}`).send(updateData)
            expect(res.status).toBe(302)
            expect(res.headers.location).toBe(`/products/${newProduct._id}`)

            const updateProduct = await Product.findById(newProduct._id)
            expect(updateProduct.name).toBe('Zapato')
            expect(updateProduct.description).toBe('Zapato de prueba')
            expect(updateProduct.price).toBe(48)
        })
    })

    describe('DELETE /dashboard/:productId/delete', () => {
        it('should delete a product and redirect to /products', async () => {
            const newProduct = new Product({
                name: 'Zapato',
                description: 'Zapato de prueba',
                image: 'http://zapato.com/image.jpg',
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
