# E2E Testing Suite for Ecommerce Module

This directory contains comprehensive end-to-end tests for the ecommerce module using Playwright.

## Test Structure

### Files
- `ecommerce.spec.ts` - Comprehensive test suite covering all ecommerce functionality
- `ecommerce-focused.spec.ts` - Focused tests using page object model for better maintainability
- `pages/ecommerce.page.ts` - Page object models for ecommerce and wishlist pages

### Test Coverage

#### 🛍️ Product Catalog
- Product grid display and layout
- Product filtering by category, price, brand, etc.
- Search functionality
- Product badges (Sale, New, Out of Stock)
- View toggles (Grid/List)
- Pagination
- Product information display

#### ❤️ Wishlist Functionality
- Adding products to wishlist from product pages
- Wishlist counter updates
- Bulk selection and operations
- Adding selected items to cart
- Removing individual items
- Clearing entire wishlist
- Empty state handling
- Toast notifications

#### 🛒 Shopping Cart
- Adding products to cart
- Cart counter updates
- Out of stock product handling
- Cross-page state persistence

#### 📱 Mobile Responsiveness
- Mobile menu functionality
- Mobile navigation
- Mobile search
- Touch interactions
- Responsive layout verification

#### 🎯 Performance & Error Handling
- Page load times
- Rapid interaction handling
- State persistence across navigation
- Filter combinations
- Edge cases and error states

## Running Tests

### Prerequisites
1. Ensure the Angular development server is running:
   ```bash
   npm start
   ```
   Server should be available at `http://localhost:4200`

### Test Commands

```bash
# Run all E2E tests
npm run e2e

# Run tests with UI mode (interactive)
npm run e2e:ui

# Run tests in headed mode (see browser)
npm run e2e:headed

# Debug tests step by step
npm run e2e:debug

# View test report
npm run e2e:report
```

### Running Specific Tests

```bash
# Run only ecommerce tests
npx playwright test ecommerce

# Run only focused tests
npx playwright test ecommerce-focused

# Run specific test by name
npx playwright test -g "should add product to wishlist"

# Run tests on specific browser
npx playwright test --project=chromium
```

## Test Configuration

The tests are configured to run on:
- **Desktop Browsers**: Chrome, Firefox, Safari
- **Mobile Devices**: Pixel 5, iPhone 12

Configuration is in `playwright.config.ts` at the project root.

## Page Object Model

The tests use the Page Object Model pattern for better maintainability:

### EcommercePage
- Header interactions (search, navigation)
- Product grid operations
- Filter and sort actions
- Responsive helpers

### WishlistPage
- Wishlist-specific actions
- Bulk operations
- Item management

## Test Best Practices

1. **Wait Strategies**: Tests use appropriate waits for network requests and UI updates
2. **Error Handling**: Tests gracefully handle edge cases and empty states
3. **Cross-Browser**: Tests are designed to work across different browsers
4. **Mobile-First**: Responsive design is tested on mobile viewports
5. **Performance**: Load times and interaction performance are verified

## Common Test Patterns

### Adding Items to Wishlist
```typescript
await ecommercePage.addFirstProductToWishlist();
await ecommercePage.waitForToast('added to wishlist');
const count = await ecommercePage.getWishlistCount();
```

### Bulk Operations
```typescript
await wishlistPage.selectAllItems();
await wishlistPage.addSelectedItemsToCart();
await ecommercePage.waitForToast('items added to cart');
```

### Mobile Testing
```typescript
await ecommercePage.setMobileViewport();
await ecommercePage.openMobileMenu();
```

## Debugging Tests

1. **Visual Debugging**: Use `npm run e2e:headed` to see tests running
2. **Step-by-Step**: Use `npm run e2e:debug` for interactive debugging
3. **Screenshots**: Failed tests automatically capture screenshots
4. **Videos**: Test runs are recorded for failure analysis
5. **Traces**: Detailed execution traces available for debugging

## CI/CD Integration

Tests are configured for CI environments:
- Retry failed tests automatically
- Generate HTML reports
- Capture artifacts (screenshots, videos, traces)
- Run in headless mode for performance

## Test Data Management

Tests handle various data states:
- Empty wishlist scenarios
- Products with different states (sale, new, out of stock)
- Filter combinations
- Search scenarios

## Extending Tests

To add new tests:

1. **Simple Tests**: Add to existing spec files
2. **New Features**: Create new spec files following naming convention
3. **Page Objects**: Extend page objects for new UI elements
4. **Utilities**: Add helper methods to page objects

## Troubleshooting

### Common Issues

1. **Server Not Running**: Ensure `npm start` is running
2. **Port Conflicts**: Check if port 4200 is available
3. **Browser Issues**: Run `npx playwright install` to update browsers
4. **Timeout Issues**: Adjust timeout values in config if needed

### Debug Commands

```bash
# Check Playwright installation
npx playwright --version

# Install browsers
npx playwright install

# Generate test report
npx playwright show-report
```