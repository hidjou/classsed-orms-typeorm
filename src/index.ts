import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express, { Request, Response } from 'express'
import { validate } from 'class-validator'

import { User } from './entity/User'
import { Post } from './entity/Post'

const app = express()
app.use(express.json())

// CREATE
app.post('/users', async (req: Request, res: Response) => {
  const { name, email, role } = req.body

  try {
    const user = User.create({ name, email, role })

    const errors = await validate(user)
    if (errors.length > 0) throw errors

    await user.save()

    return res.status(201).json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})
// READ
app.get('/users', async (_: Request, res: Response) => {
  try {
    const users = await User.find({ relations: ['posts'] })

    return res.json(users)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})
// UPDATE
app.put('/users/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid
  const { name, email, role } = req.body

  try {
    const user = await User.findOneOrFail({ uuid })

    user.name = name || user.name
    user.email = email || user.email
    user.role = role || user.role

    await user.save()

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})
// DELETE
app.delete('/users/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid

  try {
    const user = await User.findOneOrFail({ uuid })

    await user.remove()

    return res.status(204).json({ message: 'User deleted successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})
// FIND
app.get('/users/:uuid', async (req: Request, res: Response) => {
  const uuid = req.params.uuid

  try {
    const user = await User.findOneOrFail({ uuid })

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ user: 'User not found' })
  }
})

// Create a Post
app.post('/posts', async (req: Request, res: Response) => {
  const { userUuid, title, body } = req.body

  try {
    const user = await User.findOneOrFail({ uuid: userUuid })

    const post = new Post({ title, body, user })

    await post.save()

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

// Read posts
app.get('/posts', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ relations: ['user'] })

    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

createConnection()
  .then(async () => {
    app.listen(5000, () => console.log('Server up at http://localhost:5000'))
  })
  .catch((error) => console.log(error))
