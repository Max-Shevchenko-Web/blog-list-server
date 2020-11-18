const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('to Be Defined id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined();
})

test('a valid blog can be added', async () => {
  const newBlog =  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201 || 200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)

  expect(titles).toContain(
    'TDD harms architecture'
  )
})

test('a blog without likes field will be add 0 likes', async () => {
  const newBlog =  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
  }

  const addedblog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201 || 200)
    .expect('Content-Type', /application\/json/)

    expect(addedblog.body.likes).toBe(0)
})

test('status 400 if a blog without title or  url field', async () => {
  const newBlog =  {
    author: "Robert C. Martin",
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})