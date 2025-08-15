import { Page, Locator } from '@playwright/test';

export class EcommercePage {
  readonly page: Page;

  // Header Elements
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly wishlistButton: Locator;
  readonly cartButton: Locator;
  readonly mobileMenuButton: Locator;
  readonly wishlistCounter: Locator;
  readonly cartCounter: Locator;

  // Product Grid Elements
  readonly productCards: Locator;
  readonly filtersSection: Locator;
  readonly categoryFilter: Locator;
  readonly priceRangeFilter: Locator;
  readonly brandFilter: Locator;
  readonly gridViewButton: Locator;
  readonly listViewButton: Locator;
  readonly sortDropdown: Locator;

  // Filter Elements
  readonly electronicsCategory: Locator;
  readonly clothingCategory: Locator;
  readonly inStockFilter: Locator;
  readonly clearFiltersButton: Locator;

  // Product Card Elements
  readonly firstProduct: Locator;
  readonly addToCartButtons: Locator;
  readonly wishlistButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header Elements
    this.logo = page.getByRole('link', { name: 'Zard Shop' });
    this.searchInput = page.getByPlaceholder('Search products...');
    this.wishlistButton = page.getByRole('banner').getByRole('button').filter({ hasText: /^\d+$/ }).first();
    this.cartButton = page.getByRole('banner').getByRole('button').filter({ hasText: /^\d+$/ }).last();
    this.mobileMenuButton = page.getByRole('banner').getByRole('button').first();
    this.wishlistCounter = page.locator('button[aria-label*="wishlist"] z-badge');
    this.cartCounter = page.locator('button[aria-label*="cart"] z-badge');

    // Product Grid Elements
    this.productCards = page.locator('z-card');
    this.filtersSection = page.getByText('Filters');
    this.categoryFilter = page.getByText('Category');
    this.priceRangeFilter = page.getByText('Price Range');
    this.brandFilter = page.getByText('Brand');
    this.gridViewButton = page.getByRole('button', { name: 'Grid View' });
    this.listViewButton = page.getByRole('button', { name: 'List View' });
    this.sortDropdown = page.locator('[data-testid="sort-dropdown"]');

    // Filter Elements
    this.electronicsCategory = page.getByRole('radio', { name: 'Electronics (6)' });
    this.clothingCategory = page.getByRole('radio', { name: 'Clothing (3)' });
    this.inStockFilter = page.getByRole('checkbox', { name: 'In Stock Only' });
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear All Filters' });

    // Product Card Elements
    this.firstProduct = this.productCards.first();
    this.addToCartButtons = page.getByRole('button', { name: 'Add to Cart' });
    this.wishlistButtons = page.locator('z-card button').first();
  }

  // Navigation Methods
  async navigateToProducts() {
    await this.page.goto('/shop/products');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToWishlist() {
    await this.page.goto('/shop/wishlist');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCart() {
    await this.page.goto('/shop/cart');
    await this.page.waitForLoadState('networkidle');
  }

  // Header Actions
  async searchForProduct(searchTerm: string) {
    await this.searchInput.first().fill(searchTerm);
    await this.searchInput.first().press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickWishlistButton() {
    await this.wishlistButton.click();
  }

  async clickCartButton() {
    await this.cartButton.click();
  }

  // Product Actions
  async addFirstProductToCart() {
    await this.firstProduct.getByRole('button', { name: 'Add to Cart' }).click();
    await this.page.waitForTimeout(1000);
  }

  async addFirstProductToWishlist() {
    await this.firstProduct.locator('button').first().click();
    await this.page.waitForTimeout(1000);
  }

  async addProductToCartByIndex(index: number) {
    await this.productCards.nth(index).getByRole('button', { name: 'Add to Cart' }).click();
    await this.page.waitForTimeout(1000);
  }

  async addProductToWishlistByIndex(index: number) {
    await this.productCards.nth(index).locator('button').first().click();
    await this.page.waitForTimeout(1000);
  }

  // Filter Actions
  async filterByCategory(category: string) {
    switch (category.toLowerCase()) {
      case 'electronics':
        await this.electronicsCategory.click();
        break;
      case 'clothing':
        await this.clothingCategory.click();
        break;
    }
    await this.page.waitForTimeout(1000);
  }

  async filterByInStock() {
    await this.inStockFilter.click();
    await this.page.waitForTimeout(1000);
  }

  async clearAllFilters() {
    await this.clearFiltersButton.click();
    await this.page.waitForTimeout(1000);
  }

  // Utility Methods
  async getProductCount() {
    return await this.productCards.count();
  }

  async getWishlistCount() {
    const count = await this.wishlistCounter.textContent().catch(() => '0');
    return parseInt(count || '0');
  }

  async getCartCount() {
    const count = await this.cartCounter.textContent().catch(() => '0');
    return parseInt(count || '0');
  }

  async waitForToast(message: string) {
    await this.page.locator(`text=${message}`).waitFor({ state: 'visible', timeout: 5000 });
  }

  async getFirstProductName() {
    return await this.firstProduct.locator('h3').textContent();
  }

  async getFirstProductPrice() {
    return await this.firstProduct.locator('text=/\\$\\d+/').textContent();
  }

  // Responsive Helper Methods
  async setMobileViewport() {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setDesktopViewport() {
    await this.page.setViewportSize({ width: 1200, height: 800 });
  }
}

export class WishlistPage {
  readonly page: Page;

  // Wishlist Elements
  readonly pageTitle: Locator;
  readonly itemsCount: Locator;
  readonly selectAllButton: Locator;
  readonly clearAllButton: Locator;
  readonly addSelectedToCartButton: Locator;
  readonly removeSelectedButton: Locator;
  readonly wishlistItems: Locator;
  readonly emptyStateMessage: Locator;
  readonly continueShoppingButton: Locator;
  readonly bulkActionsSummary: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByHeading('My Wishlist');
    this.itemsCount = page.getByText(/\d+ items? saved for later/);
    this.selectAllButton = page.getByRole('button', { name: 'Select All' });
    this.clearAllButton = page.getByRole('button', { name: 'Clear All' });
    this.addSelectedToCartButton = page.getByRole('button', { name: /Add Selected to Cart/ });
    this.removeSelectedButton = page.getByRole('button', { name: 'Remove Selected' });
    this.wishlistItems = page.locator('z-card');
    this.emptyStateMessage = page.getByText('Your wishlist is empty');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.bulkActionsSummary = page.getByText(/\d+ items selected/);
  }

  async selectAllItems() {
    await this.selectAllButton.click();
    await this.page.waitForTimeout(500);
  }

  async addSelectedItemsToCart() {
    await this.addSelectedToCartButton.click();
    await this.page.waitForTimeout(1000);
  }

  async removeSelectedItems() {
    await this.removeSelectedButton.click();
    await this.page.waitForTimeout(1000);
  }

  async removeFirstItem() {
    await this.wishlistItems.first().locator('button').last().click();
    await this.page.waitForTimeout(1000);
  }

  async clearAllItems() {
    await this.clearAllButton.click();
    await this.page.waitForTimeout(1000);
  }

  async getItemCount() {
    return await this.wishlistItems.count();
  }

  async selectItemByIndex(index: number) {
    await this.wishlistItems.nth(index).locator('input[type="checkbox"]').click();
    await this.page.waitForTimeout(500);
  }
}