const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = await new User(helper.initialUser)
  await user.save()

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

// test('all blogs are returned', async () => {
//   const response = await api.get('/api/blogs')
//   expect(response.body).toHaveLength(helper.initialBlogs.length)
// })

// test('to Be Defined id', async () => {
//   const response = await api.get('/api/blogs')
//   expect(response.body[0].id).toBeDefined();
// })

// test('a valid blog with token can be added', async () => {
//   const testUser = {
//     "username": helper.initialUser.username,
//     "password": helper.initialUser.password
//   }

//   console.log(testUser);

//   const loginUser = await api
//     .post('/api/login')
//     .send(testUser)
//     .expect(200)

//   console.log('TOKEN', loginUser);

//   const newBlog =  {
//     title: "TDD harms architecture",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//     likes: 5,
//   }

//   await api
//     .post('/api/blogs')
//     .set('Authorization', loginUser.token)
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)

//   const blogsAtEnd = await helper.blogsInDb()
//   expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

//   const titles = blogsAtEnd.map(n => n.title)

//   expect(titles).toContain(
//     'TDD harms architecture'
//   )
// })

test('valid blog without token failed', async () => {
  const newBlog =  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length )
})

// test('a blog without likes field will be add 0 likes', async () => {
//   const newBlog =  {
//     title: "Type wars",
//     author: "Robert C. Martin",
//     url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//   }

//   const addedblog = await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(201 || 200)
//     .expect('Content-Type', /application\/json/)

//     expect(addedblog.body.likes).toBe(0)
// })

// test('status 400 if a blog without title or  url field', async () => {
//   const newBlog =  {
//     author: "Robert C. Martin",
//     likes: 7,
//   }

//   await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(400)
// })

// describe('deletion of a blog', () => {
//   test('succeeds with status code 204 if id is valid', async () => {
//     const blogsAtStart = await helper.blogsInDb()
//     const blogToDelete = blogsAtStart[0]
//     await api
//       .delete(`/api/blogs/${blogToDelete.id}`)
//       .expect(204)

//     const blogsAtEnd = await helper.blogsInDb()

//     expect(blogsAtEnd).toHaveLength(
//       helper.initialBlogs.length - 1
//     )

//     const notDeletedTitles = blogsAtEnd.map(r => r.title)

//     expect(notDeletedTitles).not.toContain(blogToDelete.title)
//   })
// })

// describe('update of a blog', () => {
//   test('update likes in blog', async () => {
//     const blogsAtStart = await helper.blogsInDb()
//     const blogToUpdate = blogsAtStart[0]

//     const objectForUpdate = JSON.parse(JSON.stringify(blogToUpdate))
//     objectForUpdate.likes = blogToUpdate.likes + 5

//     await api
//       .put(`/api/blogs/${blogToUpdate.id}`)
//       .send(objectForUpdate)
//       .expect(200)

//     const blogsAtEnd = await helper.blogsInDb()
//     const updatedBlog = blogsAtEnd[0]
//     expect(updatedBlog.likes).toBe(blogToUpdate.likes + 5)
//   })
// })

afterAll(() => {
  mongoose.connection.close()
})