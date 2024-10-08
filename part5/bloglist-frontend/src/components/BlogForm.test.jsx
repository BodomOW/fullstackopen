import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> form calls the event handler it received as props with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#inputTitle')
  const authorInput = container.querySelector('#inputAuthor')
  const urlInput = container.querySelector('#inputURL')
  const sendButton = screen.getByText('save')

  await user.type(titleInput, 'Mr. Wrestlemania stuff')
  await user.type(authorInput, 'Shawn Michaels')
  await user.type(urlInput, 'https://wrestlemania.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Mr. Wrestlemania stuff',
    author: 'Shawn Michaels',
    url: 'https://wrestlemania.com'
  })
})