import { Injectable, signal, computed, inject } from '@angular/core';
import { WishlistItem, Product } from '../interfaces/ecommerce.interface';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private productService = inject(ProductService);
  
  private wishlistItems = signal<WishlistItem[]>([]);

  items = this.wishlistItems.asReadonly();
  totalItems = computed(() => this.wishlistItems().length);

  constructor() {
    this.loadFromStorage();
  }

  addToWishlist(product: Product): void {
    const existingItem = this.wishlistItems().find(item => item.productId === product.id);
    
    if (!existingItem) {
      const newItem: WishlistItem = {
        id: `wish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        product: product,
        addedDate: new Date()
      };

      this.wishlistItems.update(items => [...items, newItem]);
      this.saveToStorage();
    }
  }

  removeFromWishlist(productId: string): void {
    this.wishlistItems.update(items => 
      items.filter(item => item.productId !== productId)
    );
    this.saveToStorage();
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItems().some(item => item.productId === productId);
  }

  clearWishlist(): void {
    this.wishlistItems.set([]);
    this.saveToStorage();
  }

  toggleWishlist(product: Product): boolean {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
      return false;
    } else {
      this.addToWishlist(product);
      return true;
    }
  }

  getWishlistSummary() {
    const items = this.wishlistItems();
    return {
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => sum + item.product.price, 0),
      inStockItems: items.filter(item => item.product.inStock).length,
      onSaleItems: items.filter(item => item.product.isSale).length
    };
  }

  private saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('zard-shop-wishlist', JSON.stringify(this.wishlistItems()));
    }
  }

  private loadFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('zard-shop-wishlist');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Validate and rehydrate with current product data
          const validItems = parsed
            .map((item: any) => {
              const product = this.productService.getProduct(item.productId);
              if (product) {
                return {
                  ...item,
                  product: product,
                  addedDate: new Date(item.addedDate)
                };
              }
              return null;
            })
            .filter(Boolean);
          
          this.wishlistItems.set(validItems);
        } catch (error) {
          console.error('Error loading wishlist from storage:', error);
          this.wishlistItems.set([]);
        }
      }
    }
  }
}