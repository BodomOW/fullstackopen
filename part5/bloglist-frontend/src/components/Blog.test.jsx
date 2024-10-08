import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { test } from 'vitest'

describe('<Blog/ >', () => {
  let container
  const mockHandler = vi.fn()

  const blog = {
    title: 'Title >:3',
    author: 'Puchi',
    url: 'https://test-01.com',
    likes: 69,
    user: { name: 'Francisco' }
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} updateLike={mockHandler} />).container
  })

  test('renders title and author but does not renders url and number of likes', () => {
    const title = screen.findByText('Title >:3')
    const author = screen.findByText('Puchi')

    expect(title).toBeDefined()
    expect(author).toBeDefined()

    const div = container.querySelector('.blog-content')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the show button, url and number of likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const url = screen.findByText('https://test-01.com')
    const likes = screen.findByText(69)

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})


// describe('<Blog />', () => {
//   let container

//   test('at start the children are not displayed', () => {
//     const div = container.querySelector('.togglableContent')
//     expect(div).toHaveStyle('display: none')
//   })

// })