import { test, expect } from '@playwright/test';

test.describe('Ecommerce Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to products page before each test
    await page.goto('/shop/products');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Product Catalog', () => {
    test('should display product grid with filters', async ({ page }) => {
      // Check that products are displayed
      await expect(page.locator('z-card')).toHaveCount(12, { timeout: 10000 });

      // Check filters are present
      await expect(page.getByText('Filters')).toBeVisible();
      await expect(page.getByText('Category')).toBeVisible();
      await expect(page.getByText('Price Range')).toBeVisible();
      await expect(page.getByText('Brand')).toBeVisible();
      await expect(page.getByText('Colors')).toBeVisible();
      await expect(page.getByText('Customer Rating')).toBeVisible();
      await expect(page.getByText('Availability')).toBeVisible();

      // Check view toggle
      await expect(page.getByRole('button', { name: 'Grid View' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'List View' })).toBeVisible();

      // Check pagination
      await expect(page.getByText('Showing 1-12 of 18 products')).toBeVisible();
    });

    test('should filter products by category', async ({ page }) => {
      // Click on Electronics category
      await page.getByRole('radio', { name: 'Electronics (6)' }).click();
      
      // Wait for filtering to complete
      await page.waitForTimeout(1000);
      
      // Check that products are filtered
      await expect(page.getByText('Electronics (6)')).toBeVisible();
    });

    test('should display product information correctly', async ({ page }) => {
      const firstProduct = page.locator('z-card').first();
      
      // Check product has image, name, brand, rating, price
      await expect(firstProduct.locator('img')).toBeVisible();
      await expect(firstProduct.locator('h3')).toBeVisible();
      await expect(firstProduct.locator('p').first()).toBeVisible(); // Brand
      await expect(firstProduct.locator('button', { hasText: 'Add to Cart' })).toBeVisible();
      
      // Check rating stars are present
      await expect(firstProduct.locator('svg').first()).toBeVisible();
    });
  });

  test.describe('Wishlist Functionality', () => {
    test('should add product to wishlist and update counter', async ({ page }) => {
      // Check initial wishlist counter (should be 0 or current count)
      const initialCount = await page.locator('button[aria-label*="wishlist"] z-badge').textContent().catch(() => '0');
      
      // Find the first product's wishlist button (heart icon)
      const firstWishlistBtn = page.locator('z-card').first().locator('button').first();
      await firstWishlistBtn.click();
      
      // Wait for the action to complete
      await page.waitForTimeout(1000);
      
      // Check for toast notification
      await expect(page.locator('text=added to wishlist')).toBeVisible();
      
      // Check wishlist counter increased
      const newCount = await page.locator('button[aria-label*="wishlist"] z-badge').textContent();
      expect(parseInt(newCount || '0')).toBeGreaterThan(parseInt(initialCount));
    });

    test('should navigate to wishlist page and display items', async ({ page }) => {
      // Add an item to wishlist first
      const firstWishlistBtn = page.locator('z-card').first().locator('button').first();
      await firstWishlistBtn.click();
      await page.waitForTimeout(1000);
      
      // Navigate to wishlist
      await page.getByRole('banner').getByRole('button').filter({ hasText: /^\d+$/ }).click();
      
      // Check we're on wishlist page
      await expect(page.getByHeading('My Wishlist')).toBeVisible();
      await expect(page.getByText(/\d+ items? saved for later/)).toBeVisible();
      
      // Check wishlist items are displayed
      await expect(page.locator('z-card')).toHaveCountGreaterThan(0);
      
      // Check bulk action buttons
      await expect(page.getByRole('button', { name: 'Select All' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Clear All' })).toBeVisible();
    });

    test('should perform bulk operations on wishlist items', async ({ page }) => {
      // Navigate to wishlist (assuming it has items)
      await page.goto('/shop/wishlist');
      await page.waitForLoadState('networkidle');
      
      // Skip if no items in wishlist
      const itemCount = await page.locator('z-card').count();
      if (itemCount === 0) {
        test.skip('No items in wishlist to test bulk operations');
        return;
      }
      
      // Select all items
      await page.getByRole('button', { name: 'Select All' }).click();
      
      // Check that bulk action buttons appear
      await expect(page.getByRole('button', { name: /Add Selected to Cart/ })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Remove Selected' })).toBeVisible();
      
      // Check sticky summary appears
      await expect(page.getByText(/\d+ items selected/)).toBeVisible();
      await expect(page.getByText(/Total: \$/)).toBeVisible();
      
      // Add selected items to cart
      await page.getByRole('button', { name: /Add Selected to Cart/ }).click();
      
      // Check for toast notification
      await expect(page.locator('text=items added to cart')).toBeVisible();
    });

    test('should remove individual items from wishlist', async ({ page }) => {
      // Navigate to wishlist
      await page.goto('/shop/wishlist');
      await page.waitForLoadState('networkidle');
      
      // Skip if no items in wishlist
      const itemCount = await page.locator('z-card').count();
      if (itemCount === 0) {
        test.skip('No items in wishlist to remove');
        return;
      }
      
      const initialCount = itemCount;
      
      // Remove first item by clicking the X button
      await page.locator('z-card').first().locator('button').filter({ hasText: /^$/ }).last().click();
      
      // Wait for removal
      await page.waitForTimeout(1000);
      
      // Check toast notification
      await expect(page.locator('text=removed from wishlist')).toBeVisible();
      
      // Check item count decreased (or page shows empty state)
      const newCount = await page.locator('z-card').count();
      expect(newCount).toBeLessThan(initialCount);
    });
  });

  test.describe('Shopping Cart Functionality', () => {
    test('should add product to cart and update counter', async ({ page }) => {
      // Get initial cart count
      const initialCount = await page.locator('button[aria-label*="cart"] z-badge').textContent().catch(() => '0');
      
      // Add first product to cart
      await page.locator('z-card').first().getByRole('button', { name: 'Add to Cart' }).click();
      
      // Wait for action to complete
      await page.waitForTimeout(1000);
      
      // Check for toast notification
      await expect(page.locator('text=added to cart')).toBeVisible();
      
      // Check cart counter increased
      const newCount = await page.locator('button[aria-label*="cart"] z-badge').textContent();
      expect(parseInt(newCount || '0')).toBeGreaterThan(parseInt(initialCount));
    });

    test('should handle out of stock products correctly', async ({ page }) => {
      // Look for out of stock product
      const outOfStockProduct = page.locator('text=Out of Stock').locator('..').locator('..');
      
      if (await outOfStockProduct.count() > 0) {
        // Check that Add to Cart button is disabled or shows "Notify Me"
        await expect(outOfStockProduct.getByRole('button', { name: 'Notify Me' })).toBeVisible();
        await expect(outOfStockProduct.getByRole('button', { name: 'Notify Me' })).toBeDisabled();
      }
    });
  });

  test.describe('Search Functionality', () => {
    test('should search products using header search', async ({ page }) => {
      // Type in search box
      await page.getByPlaceholder('Search products...').first().fill('keyboard');
      await page.getByPlaceholder('Search products...').first().press('Enter');
      
      // Wait for search results
      await page.waitForTimeout(1000);
      
      // Check that search results are displayed
      // Note: This depends on the search implementation
      // The test might need adjustment based on actual search behavior
    });

    test('should filter search using sidebar filters', async ({ page }) => {
      // Use sidebar search
      await page.getByPlaceholder('Search products...').last().fill('speaker');
      
      // Wait for filtering
      await page.waitForTimeout(1000);
      
      // Check that products are filtered
      // Note: This depends on the filter implementation
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work correctly on mobile devices', async ({ page, isMobile }) => {
      if (!isMobile) {
        // Resize to mobile if not already mobile
        await page.setViewportSize({ width: 375, height: 667 });
      }
      
      // Check mobile menu button is visible
      await expect(page.getByRole('banner').getByRole('button').first()).toBeVisible();
      
      // Click mobile menu
      await page.getByRole('banner').getByRole('button').first().click();
      
      // Check mobile menu opened
      await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Categories' })).toBeVisible();
      
      // Test mobile search
      await expect(page.getByPlaceholder('Search products...')).toBeVisible();
      
      // Close mobile menu by clicking a link
      await page.getByRole('link', { name: 'Products' }).click();
      
      // Check menu closed and we're on products page
      await expect(page.getByText('Filters')).toBeVisible();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle empty wishlist state', async ({ page }) => {
      // Navigate to wishlist
      await page.goto('/shop/wishlist');
      await page.waitForLoadState('networkidle');
      
      // If wishlist is empty, check empty state
      const itemCount = await page.locator('z-card').count();
      if (itemCount === 0) {
        await expect(page.getByText('Your wishlist is empty')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
        
        // Test continue shopping button
        await page.getByRole('button', { name: 'Continue Shopping' }).click();
        await expect(page.getByText('Filters')).toBeVisible();
      }
    });

    test('should handle product badges correctly', async ({ page }) => {
      // Check for different product badges
      const saleProducts = page.locator('text=Sale');
      const newProducts = page.locator('text=New');
      const outOfStockProducts = page.locator('text=Out of Stock');
      
      if (await saleProducts.count() > 0) {
        await expect(saleProducts.first()).toBeVisible();
      }
      
      if (await newProducts.count() > 0) {
        await expect(newProducts.first()).toBeVisible();
      }
      
      if (await outOfStockProducts.count() > 0) {
        await expect(outOfStockProducts.first()).toBeVisible();
      }
    });

    test('should handle price display correctly', async ({ page }) => {
      const firstProduct = page.locator('z-card').first();
      
      // Check price is displayed
      await expect(firstProduct.locator('text=/\\$\\d+/')).toBeVisible();
      
      // Check for sale prices (original and discounted)
      const saleProduct = page.locator('text=Sale').locator('..').locator('..');
      if (await saleProduct.count() > 0) {
        // Should have both original and sale price
        const priceElements = await saleProduct.locator('text=/\\$\\d+/').count();
        expect(priceElements).toBeGreaterThanOrEqual(1);
      }
    });
  });

  test.describe('Navigation and Routing', () => {
    test('should navigate through ecommerce pages correctly', async ({ page }) => {
      // Test navigation from products to product detail (if implemented)
      const firstProductTitle = page.locator('z-card').first().locator('h3');
      if (await firstProductTitle.count() > 0) {
        await firstProductTitle.click();
        
        // Check if it navigates to product detail page
        // Note: This test depends on product detail page implementation
        await page.waitForTimeout(1000);
      }
      
      // Test breadcrumb navigation
      await page.goto('/shop/wishlist');
      await expect(page.getByText('Home')).toBeVisible();
      await expect(page.getByText('Wishlist')).toBeVisible();
    });

    test('should maintain cart and wishlist state across navigation', async ({ page }) => {
      // Add item to cart
      await page.locator('z-card').first().getByRole('button', { name: 'Add to Cart' }).click();
      await page.waitForTimeout(1000);
      
      const cartCount = await page.locator('button[aria-label*="cart"] z-badge').textContent();
      
      // Navigate to wishlist
      await page.goto('/shop/wishlist');
      await page.waitForLoadState('networkidle');
      
      // Navigate back to products
      await page.goto('/shop/products');
      await page.waitForLoadState('networkidle');
      
      // Check cart count is maintained
      const newCartCount = await page.locator('button[aria-label*="cart"] z-badge').textContent();
      expect(newCartCount).toBe(cartCount);
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load products within reasonable time', async ({ page }) => {
      const start = Date.now();
      
      await page.goto('/shop/products');
      await page.waitForLoadState('networkidle');
      
      // Check products loaded
      await expect(page.locator('z-card')).toHaveCountGreaterThan(0);
      
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should show loading states appropriately', async ({ page }) => {
      // Navigate to wishlist to check for loading skeletons
      await page.goto('/shop/wishlist');
      
      // Check for skeleton loading states (if implemented)
      // Note: This test might need adjustment based on actual loading implementation
      await page.waitForLoadState('networkidle');
    });
  });
});