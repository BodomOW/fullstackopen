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
        await expect(likeBtnContainer.getByText('1')).toBeVisible()
      })
    })

  })

})