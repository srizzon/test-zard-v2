import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../shared/services/product.service';
import { CartService } from '../shared/services/cart.service';
import { WishlistService } from '../shared/services/wishlist.service';
import { Product } from '../shared/interfaces/ecommerce.interface';
import { toast } from 'ngx-sonner';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardAlertComponent } from '@shared/components/alert/alert.component';
import { ZardSkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { ZardBreadcrumbModule } from '@shared/components/breadcrumb/breadcrumb.module';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardBadgeComponent,
    ZardAlertComponent,
    ZardSkeletonComponent,
    ZardBreadcrumbModule
  ],
  template: `
    <div class="container mx-auto px-6 py-8">
      <!-- Breadcrumb -->
      <z-breadcrumb class="mb-6">
        <z-breadcrumb-item href="/">Home</z-breadcrumb-item>
        <z-breadcrumb-separator />
        <z-breadcrumb-item>Wishlist</z-breadcrumb-item>
      </z-breadcrumb>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">My Wishlist</h1>
        <p class="text-muted-foreground">
          {{ wishlistService.totalItems() }} {{ wishlistService.totalItems() === 1 ? 'item' : 'items' }} saved for later
        </p>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
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
      } @else if (wishlistItems().length === 0) {
        <!-- Empty State -->
        <div class="text-center py-16">
          <div class="w-24 h-24 mx-auto mb-6 text-muted-foreground">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <z-alert 
            zType="info" 
            zTitle="Your wishlist is empty"
            zDescription="Start browsing and save products you love to your wishlist."
            class="max-w-md mx-auto"
          />
          <div class="mt-6">
            <button z-button routerLink="/shop/products">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
              </svg>
              Continue Shopping
            </button>
          </div>
        </div>
      } @else {
        <!-- Wishlist Items -->
        <div class="space-y-6">
          <!-- Actions Bar -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <button 
                z-button 
                zType="outline" 
                zSize="sm"
                (click)="selectAll()"
                [disabled]="wishlistItems().length === 0"
              >
                {{ allSelected() ? 'Deselect All' : 'Select All' }}
              </button>
              
              @if (selectedItems().length > 0) {
                <span class="text-sm text-muted-foreground">
                  {{ selectedItems().length }} selected
                </span>
              }
            </div>

            <div class="flex items-center gap-2">
              @if (selectedItems().length > 0) {
                <button 
                  z-button 
                  zType="outline" 
                  zSize="sm"
                  (click)="addSelectedToCart()"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v4m4-4v4"/>
                  </svg>
                  Add Selected to Cart ({{ selectedItems().length }})
                </button>
                
                <button 
                  z-button 
                  zType="destructive" 
                  zSize="sm"
                  (click)="removeSelected()"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Remove Selected
                </button>
              }

              <button z-button zType="outline" zSize="sm" (click)="clearWishlist()">
                Clear All
              </button>
            </div>
          </div>

          <!-- Product Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (item of wishlistItems(); track item.id) {
              <z-card class="group hover:shadow-lg transition-shadow duration-200 relative">
                <!-- Selection Checkbox -->
                <div class="absolute top-3 left-3 z-10">
                  <label class="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      [checked]="selectedItems().includes(item.productId)"
                      (change)="toggleSelection(item.productId)"
                      class="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    />
                  </label>
                </div>

                <!-- Remove from Wishlist -->
                <button
                  class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  (click)="removeFromWishlist(item.productId)"
                >
                  <div class="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </div>
                </button>

                <!-- Product Image -->
                <div class="aspect-square relative overflow-hidden rounded-t-lg cursor-pointer" [routerLink]="['/shop/product-detail', item.productId]">
                  <img
                    [src]="item.product.images[0]"
                    [alt]="item.product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  @if (item.product.isSale) {
                    <z-badge zType="destructive" class="absolute bottom-2 left-2">Sale</z-badge>
                  }
                  @if (item.product.isNew) {
                    <z-badge zType="default" class="absolute bottom-2 right-2">New</z-badge>
                  }
                  @if (!item.product.inStock) {
                    <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <z-badge zType="destructive">Out of Stock</z-badge>
                    </div>
                  }
                </div>

                <div class="p-4 space-y-3">
                  <!-- Product Info -->
                  <div>
                    <h3 class="font-medium line-clamp-2 cursor-pointer hover:text-primary transition-colors" 
                        [routerLink]="['/shop/product-detail', item.productId]">
                      {{ item.product.name }}
                    </h3>
                    <p class="text-sm text-muted-foreground">{{ item.product.brand }}</p>
                  </div>

                  <!-- Rating -->
                  <div class="flex items-center space-x-1">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="w-4 h-4" 
                           [class.text-yellow-400]="star <= item.product.rating"
                           [class.text-muted-foreground]="star > item.product.rating"
                           fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    }
                    <span class="text-sm text-muted-foreground">({{ item.product.reviewCount }})</span>
                  </div>

                  <!-- Price and Actions -->
                  <div class="space-y-3">
                    <div class="flex items-center space-x-2">
                      <span class="font-bold text-lg">\${{ item.product.price }}</span>
                      @if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
                        <span class="text-sm text-muted-foreground line-through">\${{ item.product.originalPrice }}</span>
                      }
                    </div>

                    <div class="flex gap-2">
                      <button
                        z-button
                        zSize="sm"
                        [disabled]="!item.product.inStock"
                        (click)="addToCart(item.product)"
                        class="flex-1"
                      >
                        @if (item.product.inStock) {
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v4m4-4v4"/>
                          </svg>
                          Add to Cart
                        } @else {
                          Notify Me
                        }
                      </button>
                    </div>
                  </div>

                  <!-- Added Date -->
                  <div class="text-xs text-muted-foreground">
                    Added {{ getRelativeDate(item.addedDate) }}
                  </div>
                </div>
              </z-card>
            }
          </div>

          <!-- Bulk Actions Summary -->
          @if (selectedItems().length > 0) {
            <div class="sticky bottom-6 z-40">
              <z-card class="max-w-md mx-auto bg-background/95 backdrop-blur-sm border shadow-lg">
                <div class="p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">{{ selectedItems().length }} items selected</p>
                      <p class="text-sm text-muted-foreground">Total: \${{ getSelectedTotal() }}</p>
                    </div>
                    <div class="flex gap-2">
                      <button 
                        z-button 
                        zSize="sm"
                        (click)="addSelectedToCart()"
                      >
                        Add to Cart
                      </button>
                      <button 
                        z-button 
                        zType="outline" 
                        zSize="sm"
                        (click)="clearSelection()"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </z-card>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class WishlistComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  public wishlistService = inject(WishlistService);

  isLoading = signal(false);
  selectedItems = signal<string[]>([]);

  wishlistItems = this.wishlistService.items;

  allSelected = computed(() => 
    this.wishlistItems().length > 0 && 
    this.selectedItems().length === this.wishlistItems().length
  );

  selectAll() {
    if (this.allSelected()) {
      this.selectedItems.set([]);
    } else {
      this.selectedItems.set(this.wishlistItems().map(item => item.productId));
    }
  }

  toggleSelection(productId: string) {
    const current = this.selectedItems();
    if (current.includes(productId)) {
      this.selectedItems.set(current.filter(id => id !== productId));
    } else {
      this.selectedItems.set([...current, productId]);
    }
  }

  clearSelection() {
    this.selectedItems.set([]);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    toast.success(`${product.name} added to cart!`);
  }

  addSelectedToCart() {
    const selectedProducts = this.wishlistItems()
      .filter(item => this.selectedItems().includes(item.productId))
      .map(item => item.product);

    selectedProducts.forEach(product => {
      this.cartService.addToCart(product);
    });

    toast.success(`${selectedProducts.length} items added to cart!`);
    this.clearSelection();
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId);
    this.selectedItems.update(items => items.filter(id => id !== productId));
    toast.success('Item removed from wishlist');
  }

  removeSelected() {
    this.selectedItems().forEach(productId => {
      this.wishlistService.removeFromWishlist(productId);
    });
    
    toast.success(`${this.selectedItems().length} items removed from wishlist`);
    this.clearSelection();
  }

  clearWishlist() {
    this.wishlistService.clearWishlist();
    this.clearSelection();
    toast.success('Wishlist cleared');
  }

  getSelectedTotal(): number {
    return this.wishlistItems()
      .filter(item => this.selectedItems().includes(item.productId))
      .reduce((total, item) => total + item.product.price, 0);
  }

  getRelativeDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }
}