// import { useSelector } from 'react-redux'

// const BlogList = () => {
//   const user = useSelector(state => state.login.user)
//   console.log('user in BlogList:', user)
//   return (
//     <>
//       <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
//       <h2>Create new</h2>
//       {blogForm()}
//       <button className='btn-sort' onClick={handleSort}>Sort by likes {sortDesc ? '↓' : '↑'}</button>
//       {blogs.map(blog =>
//         <Blog key={blog.id} blog={blog} updateLike={addLike} remove={handleDelete} user={user.name} />
//       )}
//     </>
//   )
// }

// export default BlogList