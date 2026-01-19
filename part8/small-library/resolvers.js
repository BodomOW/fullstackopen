const { GraphQLError } = require('graphql')

const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {}

      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }

      if (args.name) {
        const author = await Author.findOne({ name: args.name })
        if (author) {
          query.author = author._id
        } else {
          return [] // No author found with that name
        }
      }

      return await Book.find(query).populate('author')
    },
    allAuthors: async () => {
      return await Author.find({})
    },
  },
  Author: {
    bookCount: async (root) => await Book.countDocuments({ author: root._id })
  },
  Mutation: {
    addBook: async (root, args) => {
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
    editAuthor: async (root, args) => {
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
    }
  }
}

module.exports = resolvers