const dummy = (blogs) => {
  const res = blogs ? 1 : 0
  return res
}

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return totalLikes
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const mostLikedBlog = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])

  const result = {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}