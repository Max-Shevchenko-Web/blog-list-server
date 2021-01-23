const Blog = require('../models/blog')
const User = require('../models/user')

const initialUser = {
  "username": "User",
  "name": "user",
  "password": "useruser"
}

const initialBlogs = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 3,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 1,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: "No blog title",
    author: "No blog author",
    url: "http://localhost/3000",
    likes: 0,
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, initialUser
}