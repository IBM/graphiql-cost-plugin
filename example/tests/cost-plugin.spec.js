// Copyright IBM Corp. 2026. All Rights Reserved.
// Node module: graphiql-cost-plugin
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const { test, expect } = require('@playwright/test')

const BACKEND_URL = 'https://swapi-graphql.netlify.app/.netlify/functions/index'

// Mocked responses matching what the live backend returns for {accounts(limit:1){name{first}}}
const MOCK_GRAPHQL_RESPONSE = {
  data: {
    accounts: [{ name: { first: 'Rebeka' } }],
    __cost: {
      requestCosts: {
        fieldCost: 2,
        typeCost: 3,
        fieldCounts: [
          { name: 'Query.accounts', value: 1 },
          { name: 'Account.name', value: 1 }
        ],
        typeCounts: [
          { name: 'Query', value: 1 },
          { name: 'Account', value: 1 },
          { name: 'Name', value: 1 }
        ]
      }
    },
    __rateLimit: {
      planName: 'default',
      rateLimits: [
        {
          name: 'graphql-field-cost',
          rateLimits: [
            {
              __typename: '__RateLimitRateLimitDetails',
              isHardLimit: true,
              rate: 100,
              interval: 1,
              unit: 'second',
              remaining: 98
            }
          ]
        },
        {
          name: 'graphql-type-cost',
          rateLimits: [
            {
              __typename: '__RateLimitRateLimitDetails',
              isHardLimit: true,
              rate: 20,
              interval: 1,
              unit: 'second',
              remaining: 17
            }
          ]
        }
      ]
    }
  }
}

test.describe('GraphiQL Cost Plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads the GraphiQL editor', async ({ page }) => {
    await expect(page.locator('.graphiql-container')).toBeVisible()
  })

  test('renders the cost plugin wrapper in the footer', async ({ page }) => {
    await expect(page.locator('.qcs_wrapper')).toBeVisible()
  })

  test('shows the initial "No data yet" state', async ({ page }) => {
    await expect(page.locator('.qcs_wrapper')).toContainText('No data yet')
  })

  test('executes a query and shows a valid response with cost data', async ({ page }) => {
    // Intercept the backend — headless Chromium is blocked by CORS from hitting the live APIC endpoint
    await page.route(BACKEND_URL, route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_GRAPHQL_RESPONSE)
    }))

    // Clear the default query and type a valid one
    const editor = page.locator('section.query-editor .CodeMirror')
    await editor.click()
    await page.keyboard.press('Meta+A')
    await page.keyboard.type('{accounts(limit:1){name{first}}}')

    // Click the Execute Query play button
    await page.locator('button.execute-button').click()

    // The response panel should contain the account data returned by the live backend
    await expect(page.locator('.result-window')).toContainText('Rebeka', { timeout: 15000 })

    // The cost plugin should now show cost data (no longer "No data yet")
    await expect(page.locator('.qcs_wrapper')).not.toContainText('No data yet', { timeout: 15000 })
    await expect(page.locator('.qcs_wrapper')).toContainText('Query limits:')
    await expect(page.locator('.qcs_wrapper')).toContainText('6 times per 1 second')
  })

  test('typing in the query editor triggers cost data without hitting execute', async ({ page }) => {
    // Intercept the backend so cost fetch succeeds in headless mode
    await page.route(BACKEND_URL, route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_GRAPHQL_RESPONSE)
    }))

    // Type a valid query into the editor — this triggers onEditQuery → fetchCostData
    const editor = page.locator('section.query-editor .CodeMirror')
    await editor.click()
    await page.keyboard.press('Meta+A')
    await page.keyboard.type('{accounts(limit:1){name{first}}}')

    // Add a space to fire another onEditQuery event
    await page.keyboard.type(' ')

    // Cost plugin should update without needing to hit the execute button
    await expect(page.locator('.qcs_wrapper')).not.toContainText('No data yet', { timeout: 15000 })
    await expect(page.locator('.qcs_wrapper')).toContainText('Query limits:')
    await expect(page.locator('.qcs_wrapper')).toContainText('6 times per 1 second')
  })
})
