const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Marco Hernandez',
        username: 'bodomow',
        password: 'wildchild777'
      }
    })
    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'bodomow', 'wildchild777')

      await expect(page.getByText('Marco Hernandez logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'bodomow', 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Marco Hernandez logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'bodomow', 'wildchild777')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'How to open a cookie jar', 'red velvet', 'www.cookie-jar.com')
      await expect(page.getByText('How to open a cookie jar').last()).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'first blog', 'john doe', 'www.first-blog-test.com')
      })

      test('can be liked', async ({ page }) => {
        const likeBtn = await page.getByRole('button', { name: 'like' }).last()
        const likeBtnContainer = await likeBtn.locator('..')

        await page.getByRole('button', { name: 'show' }).click()
        await likeBtn.click()
        await expect(likeBtnContainer.getByText(1)).toBeVisible()
      })

      test('can be liked multiple times', async ({ page }) => {
        const likeBtn = await page.getByRole('button', { name: 'like' }).last()
        const likeBtnContainer = await likeBtn.locator('..')
        let likeCount = 0
        await page.getByRole('button', { name: 'show' }).click()
        for (let i = 0; i < 5; i++) {
          await likeBtn.click()
          likeCount = likeCount + 1
          await expect(likeBtnContainer.getByText(likeCount)).toBeVisible()
        }
      })

      test('user who added the blog can delete the blog', async ({ page }) => {
        // Enabling event handler  // Dialog window handler
        await page.on('dialog', async dialog => {
          expect(dialog.type()).toContain('confirm')
          expect(dialog.message()).toContain('Delete first blog by john doe ?')
          await dialog.accept() // Close by ussing OK button
          // await dialog.dismiss() / Close by ussing cancel
        })

        await page.getByRole('button', { name: 'show' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        await page.getByRole('p', { name: 'first blog by john doe' }).waitFor({ state: 'detached' })
        await expect(page.getByRole('p', { name: 'first blog by john doe' })).toBeHidden()
      })

      test('only the user who added the blog can see the delete button', async ({ page, request }) => {
        await page.getByRole('button', { name: 'show' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        await page.getByRole('button', { name: 'logout' }).click()

        await request.post('/api/users', {
          data: {
            name: 'David Martinez',
            username: 'davito',
            password: 'lucy'
          }
        })
        await loginWith(page, 'davito', 'lucy')

        await page.getByRole('button', { name: 'show' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeHidden()
      })
    })

    describe('and multiple blogs exists', () => {
      beforeEach(async ({ page, request }) => {
        await createBlog(page, 'first blog', 'john doe', 'www.first-blog-test.com')
        await createBlog(page, 'How to open a cookie jar', 'red velvet', 'www.cookie-jar.com')
        await createBlog(page, 'BodomOW portfolio', 'marco hernandez', 'www.https://bodomow.github.io/portfolio/')
      })

      test('blogs are arranged in descending order by likes, most liked first', async ({ page }) => {
        const blogs = [
          { title: 'first blog by john doe', likes: 3 },
          { title: 'How to open a cookie jar by red velvet', likes: 0 },
          { title: 'BodomOW portfolio by marco hernandez', likes: 1 }
        ]

        // Like the blogs as specified
        for (const blog of blogs) {
          const blogElement = await page.getByText(blog.title).last().locator('..')
          await blogElement.getByRole('button', { name: 'show' }).click()
          const likeBtn = blogElement.getByRole('button', { name: 'like' })
          for (let i = 0; i < blog.likes; i++) {
            await likeBtn.click()
            await expect(blogElement.getByText((i + 1).toString())).toBeVisible()
          }
        }

        // Sort blogs by likes
        await page.getByRole('button', { name: 'Sort by likes' }).click()

        // Get all blog like counts after sorting
        const likeCounts = await page.locator('.blog-content .likes-count').allTextContents()
        const parsedLikes = likeCounts.map(text => parseInt(text, 10))

        // Assert descending order
        for (let i = 0; i < parsedLikes.length - 1; i++) {
          expect(parsedLikes[i]).toBeGreaterThanOrEqual(parsedLikes[i + 1])
        }
      })
    })

  })

})