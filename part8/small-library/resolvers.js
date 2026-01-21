const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const User = require('./models/user')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}

      console.log('args:', args)

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        console.log('found author:', author)
        if (author) {
          query.author = author._id
        }
      }

      if (args.bookCount) {
        const authorsWithBookCount = await Author.aggregate([
          {
            $lookup: {
              from: 'books',
              localField: '_id',
              foreignField: 'author',
              as: 'books'
            }
          },
          {
            $addFields: {
              bookCount: { $size: '$books' }
            }
          },
          {
            $match: {
              bookCount: args.bookCount
            }
          }
        ])

        const authorIds = authorsWithBookCount.map(author => author._id)
        query.author = { $in: authorIds }
      }

      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }

      return await Book.find(query).populate('author')
    },
    allAuthors: async () => {
      return await Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => await Book.countDocuments({ author: root._id })
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

      if (args.title.length < 5) {
        throw new GraphQLError('Title must be at least 5 characters long', {
          extensions: {
            code: 'BAD_BOOK_INPUT',
            invalidArgs: args.title,
          }
        })
      }

      if (args.author.length < 4) {
        throw new GraphQLError('Author name must be at least 4 characters long', {
          extensions: {
            code: 'BAD_AUTHOR_INPUT',
            invalidArgs: args.author,
          }
        })
      }

      const authorExists = await Author.findOne({ name: args.author })
      let author
      if (!authorExists) {
        author = new Author({ name: args.author })
        await author.save()
      } else {
        author = authorExists
      }

      const book = new Book({ ...args, author: author._id })

      try {
        await book.populate('author')
        await book.save()
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_BOOK_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      const updatedAuthor = new Author({ ...author, born: args.setBornTo })
      try {
        await updatedAuthor.save()
      } catch (error) {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: 'BAD_AUTHOR_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return updatedAuthor
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new GraphQLError(`Creating the user failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  }
}

module.exports = resolvers