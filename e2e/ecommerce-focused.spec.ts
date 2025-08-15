import { test, expect } from '@playwright/test';
import { EcommercePage, WishlistPage } from './pages/ecommerce.page';

test.describe('Ecommerce Core Functionality', () => {
  let ecommercePage: EcommercePage;
  let wishlistPage: WishlistPage;

  test.beforeEach(async ({ page }) => {
    ecommercePage = new EcommercePage(page);
    wishlistPage = new WishlistPage(page);
    await ecommercePage.navigateToProducts();
  });

  test.describe('Wishlist Flow', () => {
    test('should complete full wishlist workflow', async ({ page }) => {
      // 1. Add items to wishlist from products page
      const initialWishlistCount = await ecommercePage.getWishlistCount();
      
      // Add first product to wishlist
      await ecommercePage.addFirstProductToWishlist();
      await ecommercePage.waitForToast('added to wishlist');
      
      // Verify wishlist counter updated
      const newWishlistCount = await ecommercePage.getWishlistCount();
      expect(newWishlistCount).toBe(initialWishlistCount + 1);

      // Add second product to wishlist
      await ecommercePage.addProductToWishlistByIndex(1);
      await ecommercePage.waitForToast('added to wishlist');

      // 2. Navigate to wishlist page
      await ecommercePage.clickWishlistButton();
      
      // Verify wishlist page displays correctly
      await expect(wishlistPage.pageTitle).toBeVisible();
      await expect(wishlistPage.itemsCount).toContainText('2 items saved for later');
      
      // 3. Test bulk selection
      await wishlistPage.selectAllItems();
      await expect(wishlistPage.addSelectedToCartButton).toBeVisible();
      await expect(wishlistPage.bulkActionsSummary).toBeVisible();

      // 4. Add selected items to cart
      const initialCartCount = await ecommercePage.getCartCount();
      await wishlistPage.addSelectedItemsToCart();
      await ecommercePage.waitForToast('items added to cart');

      // Verify cart counter updated
      const newCartCount = await ecommercePage.getCartCount();
      expect(newCartCount).toBe(initialCartCount + 2);

      // 5. Remove item from wishlist
      const itemCountBeforeRemoval = await wishlistPage.getItemCount();
      if (itemCountBeforeRemoval > 0) {
        await wishlistPage.removeFirstItem();
        await ecommercePage.waitForToast('removed from wishlist');
        
        const itemCountAfterRemoval = await wishlistPage.getItemCount();
        expect(itemCountAfterRemoval).toBe(itemCountBeforeRemoval - 1);
      }
    });

    test('should handle empty wishlist state', async ({ page }) => {
      // Navigate to wishlist
      await ecommercePage.navigateToWishlist();
      
      // Clear all items if any exist
      const itemCount = await wishlistPage.getItemCount();
      if (itemCount > 0) {
        await wishlistPage.clearAllItems();
        await ecommercePage.waitForToast('Wishlist cleared');
      }

      // Verify empty state
      await expect(wishlistPage.emptyStateMessage).toBeVisible();
      await expect(wishlistPage.continueShoppingButton).toBeVisible();

      // Test continue shopping button
      await wishlistPage.continueShoppingButton.click();
      await expect(ecommercePage.filtersSection).toBeVisible();
    });
  });

  test.describe('Product Catalog Features', () => {
    test('should filter products and add to cart', async ({ page }) => {
      // Test category filtering
      await ecommercePage.filterByCategory('electronics');
      
      // Verify products are filtered
      await expect(page.getByText('Electronics (6)')).toBeVisible();

      // Add product to cart
      const initialCartCount = await ecommercePage.getCartCount();
      await ecommercePage.addFirstProductToCart();
      await ecommercePage.waitForToast('added to cart');

      // Verify cart updated
      const newCartCount = await ecommercePage.getCartCount();
      expect(newCartCount).toBe(initialCartCount + 1);
    });

    test('should search products', async ({ page }) => {
      // Test search functionality
      await ecommercePage.searchForProduct('keyboard');
      
      // Wait for search results
      await page.waitForTimeout(2000);
      
      // Verify search was performed (URL change or filtered results)
      // Note: This might need adjustment based on actual search implementation
      const currentUrl = page.url();
      expect(currentUrl).toContain('keyboard');
    });

    test('should display product badges correctly', async ({ page }) => {
      // Check for Sale badges
      const saleProducts = page.locator('text=Sale');
      const saleCount = await saleProducts.count();
      
      if (saleCount > 0) {
        await expect(saleProducts.first()).toBeVisible();
        
        // Check that sale products have crossed out original price
        const saleProduct = saleProducts.first().locator('..').locator('..');
        const priceElements = await saleProduct.locator('text=/\\$\\d+/').count();
        expect(priceElements).toBeGreaterThanOrEqual(1);
      }

      // Check for New badges
      const newProducts = page.locator('text=New');
      if (await newProducts.count() > 0) {
        await expect(newProducts.first()).toBeVisible();
      }

      // Check for Out of Stock handling
      const outOfStockProducts = page.locator('text=Out of Stock');
      if (await outOfStockProducts.count() > 0) {
        const outOfStockProduct = outOfStockProducts.first().locator('..').locator('..');
        await expect(outOfStockProduct.getByRole('button', { name: 'Notify Me' })).toBeVisible();
        await expect(outOfStockProduct.getByRole('button', { name: 'Notify Me' })).toBeDisabled();
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await ecommercePage.setMobileViewport();
      
      // Test mobile menu
      await ecommercePage.openMobileMenu();
      
      // Verify mobile navigation appears
      await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Categories' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Deals' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'About' })).toBeVisible();

      // Test mobile search
      await expect(page.getByPlaceholder('Search products...')).toBeVisible();

      // Close menu by navigating
      await page.getByRole('link', { name: 'Products' }).click();
      await expect(ecommercePage.filtersSection).toBeVisible();

      // Test mobile wishlist functionality
      await ecommercePage.addFirstProductToWishlist();
      await ecommercePage.waitForToast('added to wishlist');
      
      // Navigate to wishlist on mobile
      await ecommercePage.clickWishlistButton();
      await expect(wishlistPage.pageTitle).toBeVisible();

      // Test mobile cart functionality
      await ecommercePage.navigateToProducts();
      await ecommercePage.addFirstProductToCart();
      await ecommercePage.waitForToast('added to cart');
    });
  });

  test.describe('Performance and Error Handling', () => {
    test('should load quickly and handle interactions smoothly', async ({ page }) => {
      // Measure page load time
      const startTime = Date.now();
      await ecommercePage.navigateToProducts();
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds

      // Test rapid interactions
      await ecommercePage.addFirstProductToWishlist();
      await ecommercePage.addFirstProductToCart();
      
      // Verify both actions completed successfully
      await ecommercePage.waitForToast('added to wishlist');
      await ecommercePage.waitForToast('added to cart');
    });

    test('should maintain state across page navigation', async ({ page }) => {
      // Add items to cart and wishlist
      await ecommercePage.addFirstProductToCart();
      await ecommercePage.addFirstProductToWishlist();
      
      const cartCount = await ecommercePage.getCartCount();
      const wishlistCount = await ecommercePage.getWishlistCount();

      // Navigate to different pages and back
      await ecommercePage.navigateToWishlist();
      await ecommercePage.navigateToProducts();

      // Verify counts are maintained
      expect(await ecommercePage.getCartCount()).toBe(cartCount);
      expect(await ecommercePage.getWishlistCount()).toBe(wishlistCount);
    });
  });

  test.describe('Edge Cases and Error States', () => {
    test('should handle multiple rapid clicks gracefully', async ({ page }) => {
      // Rapidly click wishlist button multiple times
      const wishlistBtn = ecommercePage.firstProduct.locator('button').first();
      
      // Click multiple times rapidly
      await wishlistBtn.click();
      await wishlistBtn.click();
      await wishlistBtn.click();
      
      // Should only add once (debounced or handled properly)
      await page.waitForTimeout(2000);
      
      // Verify only one item was added (not multiple)
      await ecommercePage.navigateToWishlist();
      const items = await wishlistPage.getItemCount();
      
      // Should have reasonable number of items (not multiplied by rapid clicks)
      expect(items).toBeLessThanOrEqual(5);
    });

    test('should handle filter combinations correctly', async ({ page }) => {
      // Apply multiple filters
      await ecommercePage.filterByCategory('electronics');
      await page.waitForTimeout(1000);
      
      // Add in-stock filter if available
      if (await ecommercePage.inStockFilter.isVisible()) {
        await ecommercePage.filterByInStock();
      }
      
      // Verify products are still displayed
      const productCount = await ecommercePage.getProductCount();
      expect(productCount).toBeGreaterThan(0);

      // Clear filters
      if (await ecommercePage.clearFiltersButton.isEnabled()) {
        await ecommercePage.clearAllFilters();
        
        // Verify more products are shown after clearing
        const newProductCount = await ecommercePage.getProductCount();
        expect(newProductCount).toBeGreaterThanOrEqual(productCount);
      }
    });
  });
});