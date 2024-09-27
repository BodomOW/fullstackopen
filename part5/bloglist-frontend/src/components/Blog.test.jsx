import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog/ >', () => {
  let container

  const blog = {
    title: 'Title >:3',
    author: 'Puchi',
    url: 'https://test-01.com',
    likes: 69,
    user: { name: 'Francisco' }
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container
  })

  test('renders title and author but does not renders url and number of likes', () => {
    const title = screen.findByText('Title >:3')
    const author = screen.findByText('Puchi')

    expect(title).toBeDefined()
    expect(author).toBeDefined()

    const div = container.querySelector('.blog-content')
    expect(div).toHaveStyle('display: none')
  })
})


// describe('<Blog />', () => {
//   let container

//   test('at start the children are not displayed', () => {
//     const div = container.querySelector('.togglableContent')
//     expect(div).toHaveStyle('display: none')
//   })

// })