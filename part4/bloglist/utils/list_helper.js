const dummy = (blogs) => {
  const res = blogs ? 1 : 0
  return res
}

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return totalLikes
}

module.exports = {
  dummy,
  totalLikes
}