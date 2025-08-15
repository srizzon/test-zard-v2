import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductService } from '../shared/services/product.service';
import { CartService } from '../shared/services/cart.service';
import { WishlistService } from '../shared/services/wishlist.service';
import { Product } from '../shared/interfaces/ecommerce.interface';
import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardSliderComponent } from '@shared/components/slider/slider.component';
import { ZardCheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { ZardRadioComponent } from '@shared/components/radio/radio.component';
import { ZardAccordionComponent } from '@shared/components/accordion/accordion.component';
import { ZardAccordionItemComponent } from '@shared/components/accordion/accordion-item.component';
import { ZardBreadcrumbModule } from '@shared/components/breadcrumb/breadcrumb.module';
import { ZardPaginationModule } from '@shared/components/pagination/pagination.module';
import { ZardSkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { ZardToggleGroupComponent } from '@shared/components/toggle-group/toggle-group.component';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { ZardAlertComponent } from '@shared/components/alert/alert.component';



@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardInputDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardBadgeComponent,
    ZardSliderComponent,
    ZardCheckboxComponent,
    ZardRadioComponent,
    ZardAccordionComponent,
    ZardAccordionItemComponent,
    ZardBreadcrumbModule,
    ZardPaginationModule,
    ZardSkeletonComponent,
    ZardToggleGroupComponent,
    ZardDropdownModule,
    ZardAlertComponent
  ],
  template: `
    <div class="container mx-auto px-6 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Filters Sidebar -->
          <div class="lg:col-span-1">
            <z-card zTitle="Filters" class="sticky top-8">
              <div class="space-y-6 mt-6">
                <!-- Search -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium">Search</label>
                    @if (searchQuery()) {
                      <button
                        z-button
                        zType="ghost"
                        zSize="sm"
                        (click)="clearSearchFilter()"
                        class="text-xs h-6 px-2"
                      >
                        Clear
                      </button>
                    }
                  </div>
                  <div class="relative">
                    <i class="icon-search absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground"></i>
                    <input
                      z-input
                      zSize="default"
                      class="pl-9 pr-4"
                      type="search"
                      placeholder="Search products..."
                      [(ngModel)]="searchQuery"
                      (ngModelChange)="applyFilters()"
                    />
                    @if (searchQuery()) {
                      <button
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        (click)="clearSearchFilter()"
                      >
                        <i class="icon-x text-sm"></i>
                      </button>
                    }
                  </div>
                </div>

                <z-accordion zType="multiple" [zDefaultValue]="['category', 'price', 'brand']">
                  <!-- Category Filter -->
                  <z-accordion-item zValue="category" zTitle="Category">
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        @if (selectedCategory() && selectedCategory() !== 'All') {
                          <button
                            z-button
                            zType="ghost"
                            zSize="sm"
                            (click)="clearCategoryFilter()"
                            class="text-xs h-6 px-2 ml-auto"
                          >
                            Clear Category
                          </button>
                        }
                      </div>

                      <z-radio
                        name="category"
                        value="All"
                        [(ngModel)]="selectedCategory"
                        (radioChange)="applyFilters()"
                      >
                        <div class="flex items-center justify-between w-full">
                          <span class="text-sm">All Categories</span>
                          <span class="text-xs text-muted-foreground">({{ getTotalProductCount() }})</span>
                        </div>
                      </z-radio>

                      @for (category of categories(); track category) {
                        <z-radio
                          name="category"
                          [value]="category"
                          [(ngModel)]="selectedCategory"
                          (radioChange)="applyFilters()"
                        >
                          <div class="flex items-center justify-between w-full">
                            <span class="text-sm">{{ category }}</span>
                            <span class="text-xs text-muted-foreground">({{ getCategoryCount(category) }})</span>
                          </div>
                        </z-radio>
                      }
                    </div>
                  </z-accordion-item>

                  <!-- Price Range -->
                  <z-accordion-item zValue="price" zTitle="Price Range">
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium">Up to {{ '$' + maxPrice() }}</span>
                        @if (maxPrice() < 2000) {
                          <button
                            z-button
                            zType="ghost"
                            zSize="sm"
                            (click)="clearPriceFilter()"
                            class="text-xs h-6 px-2"
                          >
                            Reset
                          </button>
                        }
                      </div>

                      <div class="px-2">
                        <z-slider
                          [zMin]="0"
                          [zMax]="2000"
                          [zStep]="50"
                          [zDefault]="maxPrice()"
                          (onSlide)="onPriceChange($event)"
                        />
                      </div>

                      <div class="flex justify-between text-xs text-muted-foreground">
                        <span>$0</span>
                        <span>$2000+</span>
                      </div>

                      <!-- Quick Price Ranges -->
                      <div class="grid grid-cols-2 gap-2">
                        <button
                          z-button
                          zType="outline"
                          zSize="sm"
                          [class.border-primary]="maxPrice() === 50"
                          (click)="setQuickPriceRange(50)"
                          class="text-xs"
                        >
                          Under $50
                        </button>
                        <button
                          z-button
                          zType="outline"
                          zSize="sm"
                          [class.border-primary]="maxPrice() === 100"
                          (click)="setQuickPriceRange(100)"
                          class="text-xs"
                        >
                          Under $100
                        </button>
                        <button
                          z-button
                          zType="outline"
                          zSize="sm"
                          [class.border-primary]="maxPrice() === 200"
                          (click)="setQuickPriceRange(200)"
                          class="text-xs"
                        >
                          Under $200
                        </button>
                        <button
                          z-button
                          zType="outline"
                          zSize="sm"
                          [class.border-primary]="maxPrice() >= 500"
                          (click)="setQuickPriceRange(2000)"
                          class="text-xs"
                        >
                          $500+
                        </button>
                      </div>
                    </div>
                  </z-accordion-item>

                  <!-- Brand Filter -->
                  <z-accordion-item zValue="brand" zTitle="Brand">
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        @if (selectedBrands().length > 0) {
                          <button
                            z-button
                            zType="ghost"
                            zSize="sm"
                            (click)="clearBrandFilter()"
                            class="text-xs h-6 px-2 ml-auto"
                          >
                            Clear Brands
                          </button>
                        }
                      </div>

                      @for (brand of brands(); track brand) {
                        <label class="flex items-center justify-between cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors">
                          <div class="flex items-center space-x-2">
                            <z-checkbox
                              [ngModel]="selectedBrands().includes(brand)"
                              (checkChange)="onBrandChange(brand, $event)"
                            />
                            <span class="text-sm">{{ brand }}</span>
                          </div>
                          <span class="text-xs text-muted-foreground">({{ getBrandCount(brand) }})</span>
                        </label>
                      }
                    </div>
                  </z-accordion-item>

                  <!-- Colors -->
                  <z-accordion-item zValue="colors" zTitle="Colors">
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        @if (selectedColors().length > 0) {
                          <button
                            z-button
                            zType="ghost"
                            zSize="sm"
                            (click)="clearColorFilter()"
                            class="text-xs h-6 px-2 ml-auto"
                          >
                            Clear Colors
                          </button>
                        }
                      </div>

                      <div class="flex flex-wrap gap-3">
                        @for (color of availableColors(); track color) {
                          <div class="flex flex-col items-center gap-1">
                            <button
                              class="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-colors relative shadow-sm"
                              [style.background-color]="getColorValue(color)"
                              [class.border-primary]="selectedColors().includes(color)"
                              [class.ring-2]="selectedColors().includes(color)"
                              [ngClass]="{'ring-primary/20': selectedColors().includes(color)}"
                              (click)="toggleColor(color)"
                            >
                              @if (selectedColors().includes(color)) {
                                <svg class="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                              }
                            </button>
                            <span class="text-xs text-muted-foreground capitalize">{{ color }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  </z-accordion-item>

                  <!-- Rating -->
                  <z-accordion-item zValue="rating" zTitle="Customer Rating">
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        @if (selectedRating() > 0) {
                          <button
                            z-button
                            zType="ghost"
                            zSize="sm"
                            (click)="clearRatingFilter()"
                            class="text-xs h-6 px-2 ml-auto"
                          >
                            Clear Rating
                          </button>
                        }
                      </div>

                      <z-radio
                        name="rating"
                        [value]="0"
                        [(ngModel)]="selectedRating"
                        (radioChange)="applyFilters()"
                      >
                        <span class="text-sm">All Ratings</span>
                      </z-radio>

                      @for (rating of [5,4,3,2,1]; track rating) {
                        <z-radio
                          name="rating"
                          [value]="rating"
                          [(ngModel)]="selectedRating"
                          (radioChange)="applyFilters()"
                          class="hover:bg-muted/30 p-2 rounded transition-colors"
                        >
                          <div class="flex items-center justify-between w-full">
                            <div class="flex items-center gap-2">
                              <div class="flex">
                                @for (star of [1,2,3,4,5]; track star) {
                                  <i class="icon-star text-sm"
                                     [class.text-yellow-400]="star <= rating"
                                     [class.text-muted-foreground]="star > rating">
                                  </i>
                                }
                              </div>
                              <span class="text-sm">& Up</span>
                            </div>
                            <span class="text-xs text-muted-foreground">({{ getRatingCount(rating) }})</span>
                          </div>
                        </z-radio>
                      }
                    </div>
                  </z-accordion-item>

                  <!-- Stock Status -->
                  <z-accordion-item zValue="stock" zTitle="Availability">
                    <div class="space-y-3">
                      <label class="flex items-center justify-between cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors">
                        <div class="flex items-center space-x-2">
                          <z-checkbox [(ngModel)]="showInStockOnly" (checkChange)="applyFilters()" />
                          <span class="text-sm">In Stock Only</span>
                        </div>
                        <span class="text-xs text-muted-foreground">({{ getInStockCount() }})</span>
                      </label>
                    </div>
                  </z-accordion-item>
                </z-accordion>

                <!-- Clear All Filters Button -->
                <div class="mt-4">
                  @if (hasActiveFilters()) {
                    <z-alert
                      zType="info"
                      zTitle="Active Filters"
                      [zDescription]="getActiveFiltersCount() + ' filter' + (getActiveFiltersCount() === 1 ? '' : 's') + ' applied'"
                    />
                  }

                  <button
                    z-button
                    [zType]="hasActiveFilters() ? 'default' : 'outline'"
                    zFull="true"
                    (click)="clearFilters()"
                    [disabled]="!hasActiveFilters()"
                  >
                    <i class="icon-filter-x mr-2 text-base"></i>
                    Clear All Filters {{ hasActiveFilters() ? '(' + getActiveFiltersCount() + ')' : '' }}
                  </button>
                </div>
              </div>
            </z-card>
          </div>

          <!-- Products Grid -->
          <div class="lg:col-span-3">
            <!-- Toolbar -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <p class="text-sm text-muted-foreground">
                  Showing {{ startIndex() + 1 }}-{{ Math.min(endIndex(), filteredProducts().length) }} of {{ filteredProducts().length }} products
                </p>
                @if (hasActiveFilters()) {
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-sm text-muted-foreground">Active filters:</span>
                    @if (searchQuery()) {
                      <z-badge zType="outline" class="text-xs">
                        Search: "{{ searchQuery() }}"
                        <button class="ml-1" (click)="clearSearchFilter()">×</button>
                      </z-badge>
                    }
                    @if (selectedCategory() && selectedCategory() !== 'All') {
                      <z-badge zType="outline" class="text-xs">
                        {{ selectedCategory() }}
                        <button class="ml-1" (click)="clearCategoryFilter()">×</button>
                      </z-badge>
                    }
                  </div>
                }
              </div>

              <div class="flex items-center gap-4">
                <!-- View Toggle -->
                <z-toggle-group
                  zMode="single"
                  [defaultValue]="viewMode()"
                  (valueChange)="setViewMode($event)"
                  [items]="[
                    { value: 'grid', label: 'Grid View' },
                    { value: 'list', label: 'List View' }
                  ]"
                />

                <!-- Sort Options -->
                <z-select [(ngModel)]="sortBy" (selectionChange)="applySorting()" class="min-w-48">
                  <z-select-item value="name-asc">Name (A-Z)</z-select-item>
                  <z-select-item value="name-desc">Name (Z-A)</z-select-item>
                  <z-select-item value="price-asc">Price (Low to High)</z-select-item>
                  <z-select-item value="price-desc">Price (High to Low)</z-select-item>
                  <z-select-item value="rating-desc">Highest Rated</z-select-item>
                  <z-select-item value="newest">Newest First</z-select-item>
                </z-select>
              </div>
            </div>

            <!-- Loading State -->
            @if (isLoading()) {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="space-y-4">
                    <z-skeleton class="aspect-square w-full rounded-lg" />
                    <div class="space-y-2">
                      <z-skeleton class="h-4 w-3/4" />
                      <z-skeleton class="h-3 w-1/2" />
                      <z-skeleton class="h-4 w-1/4" />
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- Products Grid/List -->
              @if (viewMode() === 'grid') {
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  @for (product of paginatedProducts(); track product.id) {
                    <z-card class="group hover:shadow-lg transition-shadow duration-200">
                      <div class="aspect-square relative overflow-hidden rounded-t-lg cursor-pointer" [routerLink]="['/shop/product-detail', product.id]">
                        <img
                          [src]="product.images[0]"
                          [alt]="product.name"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        @if (product.isSale) {
                          <z-badge zType="destructive" class="absolute top-2 left-2">Sale</z-badge>
                        }
                        @if (product.isNew) {
                          <z-badge zType="default" class="absolute top-2 right-2">New</z-badge>
                        }
                        @if (!product.inStock) {
                          <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <z-badge zType="destructive">Out of Stock</z-badge>
                          </div>
                        }

                        <!-- Quick Actions -->
                        <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div class="flex gap-1">
                            <button 
                              z-button 
                              zSize="icon" 
                              zType="secondary" 
                              zShape="circle" 
                              (click)="toggleWishlist(product); $event.stopPropagation()"
                              [class.text-red-500]="wishlistService.isInWishlist(product.id)"
                            >
                              <svg class="w-4 h-4" 
                                   [class.fill-current]="wishlistService.isInWishlist(product.id)"
                                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                              </svg>
                            </button>
                            <button z-button zSize="icon" zType="secondary" zShape="circle" [routerLink]="['/shop/product-detail', product.id]">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="p-4 space-y-2">
                        <div>
                          <h3 class="font-medium line-clamp-2 cursor-pointer hover:text-primary transition-colors" [routerLink]="['/shop/product-detail', product.id]">{{ product.name }}</h3>
                          <p class="text-sm text-muted-foreground">{{ product.brand }}</p>
                        </div>

                        <div class="flex items-center space-x-1">
                          @for (star of [1,2,3,4,5]; track star) {
                            <i class="icon-star text-base"
                               [class.text-yellow-400]="star <= product.rating"
                               [class.text-muted-foreground]="star > product.rating">
                            </i>
                          }
                          <span class="text-sm text-muted-foreground">({{ product.reviewCount }})</span>
                        </div>

                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <span class="font-bold text-lg">{{ '$' + product.price }}</span>
                            @if (product.originalPrice && product.originalPrice > product.price) {
                              <span class="text-sm text-muted-foreground line-through">{{ '$' + product.originalPrice }}</span>
                            }
                          </div>

                          <button
                            z-button
                            zSize="sm"
                            [disabled]="!product.inStock"
                            (click)="addToCart(product)"
                          >
                            @if (product.inStock) {
                              Add to Cart
                            } @else {
                              Notify Me
                            }
                          </button>
                        </div>
                      </div>
                    </z-card>
                  }
                </div>
              } @else {
                <!-- List View -->
                <div class="space-y-4">
                  @for (product of paginatedProducts(); track product.id) {
                    <z-card class="overflow-hidden hover:shadow-lg transition-shadow">
                      <div class="flex">
                        <div class="w-32 h-32 flex-shrink-0 relative cursor-pointer" [routerLink]="['/shop/product-detail', product.id]">
                          <img
                            [src]="product.images[0]"
                            [alt]="product.name"
                            class="w-full h-full object-cover"
                          />
                          @if (product.isSale) {
                            <z-badge zType="destructive" class="absolute top-1 left-1">Sale</z-badge>
                          }
                        </div>

                        <div class="flex-1 p-4 flex justify-between">
                          <div class="flex-1 space-y-2">
                            <div>
                              <h3 class="font-medium cursor-pointer hover:text-primary transition-colors" [routerLink]="['/shop/product-detail', product.id]">{{ product.name }}</h3>
                              <p class="text-sm text-muted-foreground">{{ product.brand }}</p>
                            </div>

                            <p class="text-sm text-muted-foreground line-clamp-2">{{ product.description }}</p>

                            <div class="flex items-center space-x-4">
                              <div class="flex items-center space-x-1">
                                @for (star of [1,2,3,4,5]; track star) {
                                  <svg class="w-4 h-4" [class.text-yellow-400]="star <= product.rating" [class.text-muted-foreground]="star > product.rating" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                }
                                <span class="text-sm text-muted-foreground">({{ product.reviewCount }})</span>
                              </div>

                              @if (product.inStock) {
                                <z-badge zType="outline" class="text-xs">In Stock</z-badge>
                              } @else {
                                <z-badge zType="destructive" class="text-xs">Out of Stock</z-badge>
                              }
                            </div>
                          </div>

                          <div class="flex flex-col justify-between items-end text-right">
                            <div>
                              <span class="font-bold text-xl">{{ '$' + product.price }}</span>
                              @if (product.originalPrice && product.originalPrice > product.price) {
                                <div class="text-sm text-muted-foreground line-through">{{ '$' + product.originalPrice }}</div>
                              }
                            </div>

                            <button
                              z-button
                              [disabled]="!product.inStock"
                              (click)="addToCart(product)"
                            >
                              @if (product.inStock) {
                                Add to Cart
                              } @else {
                                Notify Me
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    </z-card>
                  }
                </div>
              }
            }

            <!-- Pagination -->
            @if (!isLoading() && filteredProducts().length > 0) {
              <div class="flex items-center justify-center mt-8">
                <z-pagination
                  [zPageIndex]="currentPage()"
                  [zTotal]="totalPages()"
                  (zPageIndexChange)="onPageChange($event)"
                />
              </div>
            }

            <!-- No Results -->
            @if (!isLoading() && filteredProducts().length === 0) {
              <div class="text-center py-12">
                <z-alert
                  zType="info"
                  zTitle="No products found"
                  zDescription="Try adjusting your search or filter criteria to find what you're looking for."
                />
                <div class="mt-6">
                  <button z-button zType="outline" (click)="clearFilters()">Clear All Filters</button>
                </div>
              </div>
            }
          </div>
        </div>
    </div>
  `
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private dialog = inject(ZardDialogService);
  wishlistService = inject(WishlistService);

  Math = Math;

  // State management
  isLoading = signal(false);
  viewMode = signal<'grid' | 'list'>('grid');
  currentPage = signal(1);
  itemsPerPage = signal(12);
  sortBy = 'name-asc';

  // Filter state
  searchQuery = signal('');
  selectedCategory = signal('All');
  selectedBrands = signal<string[]>([]);
  minPrice = signal(0);
  maxPrice = signal(2000);
  showInStockOnly = signal(false);
  selectedRating = signal(0);
  selectedColors = signal<string[]>([]);
  selectedSizes = signal<string[]>([]);

  // Get products from service
  products = computed(() => this.productService.allProducts());


  // Computed values
  categories = computed(() => ['All', ...this.productService.categories()]);
  brands = computed(() => this.productService.brands());
  availableColors = computed(() => [...new Set(this.products().flatMap(p => p.colors))]);

  filteredProducts = computed(() => {
    let filtered = this.products();
    const filterState = {
      search: this.searchQuery(),
      category: this.selectedCategory(),
      brands: this.selectedBrands(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
      inStock: this.showInStockOnly(),
      rating: this.selectedRating(),
      colors: this.selectedColors(),
      sizes: this.selectedSizes()
    };

    if (filterState.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filterState.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filterState.search.toLowerCase()) ||
        p.brand.toLowerCase().includes(filterState.search.toLowerCase())
      );
    }

    if (filterState.category && filterState.category !== 'All') {
      filtered = filtered.filter(p => p.category === filterState.category);
    }

    if (filterState.brands.length > 0) {
      filtered = filtered.filter(p => filterState.brands.includes(p.brand));
    }

    if (filterState.maxPrice < 2000) {
      filtered = filtered.filter(p => p.price <= filterState.maxPrice);
    }

    if (filterState.inStock) {
      filtered = filtered.filter(p => p.inStock);
    }

    if (filterState.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filterState.rating);
    }

    if (filterState.colors.length > 0) {
      filtered = filtered.filter(p =>
        p.colors.some(color => filterState.colors.includes(color))
      );
    }

    return this.sortProducts(filtered);
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.itemsPerPage()));
  startIndex = computed(() => (this.currentPage() - 1) * this.itemsPerPage());
  endIndex = computed(() => this.startIndex() + this.itemsPerPage());

  paginatedProducts = computed(() => {
    const start = this.startIndex();
    const end = this.endIndex();
    return this.filteredProducts().slice(start, end);
  });

  hasActiveFilters = computed(() => {
    return this.searchQuery() ||
           (this.selectedCategory() && this.selectedCategory() !== 'All') ||
           this.selectedBrands().length > 0 ||
           this.maxPrice() < 2000 ||
           this.showInStockOnly() ||
           this.selectedRating() > 0 ||
           this.selectedColors().length > 0;
  });

  getCategoryCount(category: string): number {
    if (category === 'All') return this.products().length;
    return this.products().filter(p => p.category === category).length;
  }

  getBrandCount(brand: string): number {
    return this.products().filter(p => p.brand === brand).length;
  }

  getColorValue(color: string): string {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#ffffff',
      'gray': '#6b7280',
      'navy': '#1e3a8a',
      'blue': '#3b82f6',
      'red': '#ef4444',
      'green': '#22c55e',
      'yellow': '#eab308',
      'purple': '#a855f7',
      'pink': '#ec4899',
      'rose-gold': '#e8b4c8',
      'silver': '#c0c0c0'
    };
    return colorMap[color] || '#6b7280';
  }

  onPriceChange(value: number): void {
    this.maxPrice.set(value);
    this.applyFilters();
  }

  onBrandChange(brand: string, checked: boolean): void {
    this.selectedBrands.update(brands => {
      if (checked) {
        return [...brands, brand];
      } else {
        return brands.filter(b => b !== brand);
      }
    });
    this.applyFilters();
  }

  toggleColor(color: string): void {
    const current = this.selectedColors();
    const updated = current.includes(color)
      ? current.filter(c => c !== color)
      : [...current, color];
    this.selectedColors.set(updated);
    this.applyFilters();
  }

  applyFilters(): void {
    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
    this.selectedBrands.set([]);
    this.minPrice.set(0);
    this.maxPrice.set(2000);
    this.showInStockOnly.set(false);
    this.selectedRating.set(0);
    this.selectedColors.set([]);
    this.selectedSizes.set([]);
  }

  clearSearchFilter(): void {
    this.searchQuery.set('');
  }

  clearCategoryFilter(): void {
    this.selectedCategory.set('All');
  }

  sortProducts(products: Product[]): Product[] {
    const sortKey = this.sortBy;

    return [...products].sort((a, b) => {
      switch (sortKey) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });
  }

  applySorting(): void {
    // Force re-computation by resetting current page
    this.currentPage.set(1);
  }

  setViewMode(mode: string | string[]): void {
    const viewMode = typeof mode === 'string' ? mode as 'grid' | 'list' : 'grid';
    this.viewMode.set(viewMode);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    // Scroll to top of products
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  toggleWishlist(product: Product): void {
    const isAdded = this.wishlistService.toggleWishlist(product);
    if (isAdded) {
      toast.success(`${product.name} added to wishlist!`, {
        description: 'You can view your wishlist items later',
        duration: 3000,
      });
    } else {
      toast.success(`${product.name} removed from wishlist!`, {
        duration: 2000,
      });
    }
  }

  // Additional filter methods for improved UX
  getTotalProductCount(): number {
    return this.products().length;
  }

  clearPriceFilter(): void {
    this.maxPrice.set(2000);
    this.applyFilters();
  }

  clearBrandFilter(): void {
    this.selectedBrands.set([]);
    this.applyFilters();
  }

  clearColorFilter(): void {
    this.selectedColors.set([]);
    this.applyFilters();
  }

  clearRatingFilter(): void {
    this.selectedRating.set(0);
    this.applyFilters();
  }

  setQuickPriceRange(maxPrice: number): void {
    this.maxPrice.set(maxPrice);
    this.applyFilters();
  }

  getInStockCount(): number {
    return this.products().filter(p => p.inStock).length;
  }

  getRatingCount(rating: number): number {
    return this.products().filter(p => p.rating >= rating).length;
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.searchQuery()) count++;
    if (this.selectedCategory() !== 'All') count++;
    if (this.selectedBrands().length > 0) count++;
    if (this.maxPrice() < 2000) count++;
    if (this.selectedRating() > 0) count++;
    if (this.selectedColors().length > 0) count++;
    if (this.showInStockOnly()) count++;
    return count;
  }
}
