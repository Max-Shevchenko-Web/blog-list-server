const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const query = [
    {
        path:'user',
        select: { username: 1, name: 1, id: 1 }
    },
    {
        path:'comments',
        select: { content: 1, date: 1, user: 1, id: 1}
    }
  ]

  const blogs = await Blog.find({}).populate(query)
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body

  if (!body.likes) {
    body.likes = 0
  }

  if(!body.title || !body.url) {
    return response.status(400).end()
  }


  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const saveBlog = await blog.save()
  user.blogs = user.blogs.concat(saveBlog._id)
  await user.save()

  response.status(201).json(saveBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blogForDelete = await Blog.findById(request.params.id)
  if (!blogForDelete) {
    response.status(404).end()
  }

  if (blogForDelete.user.toString() !== user.id) {
    response.status(401).end()
  } else {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user', { username: 1, name: 1, id: 1 })
  response.json(updatedBlog)
})

// create comment to blog
blogsRouter.post('/:id/comments', async (request, response) => {
  const token = request.token

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = await Blog.findById(request.params.id)

  const body = request.body

  if (!blog) {
    response.status(404).end()
  }

  const comment = new Comment({
    content: body.content,
    date: new Date(),
    user: user._id,
    blog: blog._id
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  // user.comments = user.comments.concat(saveComment._id)
  await blog.save()

  response.status(201).json(savedComment)
})

module.exports = blogsRouter
