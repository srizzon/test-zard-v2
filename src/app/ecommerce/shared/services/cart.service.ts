import { Injectable, signal, computed } from '@angular/core';
import { toast } from 'ngx-sonner';
import { CartItem, Product } from '../interfaces/ecommerce.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  items = this.cartItems.asReadonly();
  
  totalItems = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  subtotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(product: Product, options: { color?: string; size?: string; quantity?: number } = {}) {
    const quantity = options.quantity || 1;
    const color = options.color;
    const size = options.size;

    const existingItemIndex = this.cartItems().findIndex(item => 
      item.productId === product.id && 
      item.color === color && 
      item.size === size
    );

    if (existingItemIndex >= 0) {
      this.updateQuantity(this.cartItems()[existingItemIndex].id, 
        this.cartItems()[existingItemIndex].quantity + quantity);
    } else {
      const newItem: CartItem = {
        id: this.generateId(),
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        quantity,
        color,
        size,
        inStock: product.inStock
      };

      this.cartItems.update(items => [...items, newItem]);
    }

    this.saveCartToStorage();
    
    toast.success(`${product.name} added to cart!`, {
      description: `Quantity: ${quantity}${color ? `, Color: ${color}` : ''}${size ? `, Size: ${size}` : ''}`,
      duration: 3000,
    });
  }

  removeFromCart(itemId: string) {
    const item = this.getCartItem(itemId);
    this.cartItems.update(items => items.filter(item => item.id !== itemId));
    this.saveCartToStorage();
    
    if (item) {
      toast.success(`${item.name} removed from cart`, {
        duration: 2000,
      });
    }
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    this.cartItems.update(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
    this.saveCartToStorage();
  }

  clearCart() {
    const itemCount = this.cartItems().length;
    this.cartItems.set([]);
    this.saveCartToStorage();
    
    if (itemCount > 0) {
      toast.success('Cart cleared successfully', {
        description: `Removed ${itemCount} item${itemCount === 1 ? '' : 's'} from cart`,
        duration: 2000,
      });
    }
  }

  getCartItem(itemId: string): CartItem | undefined {
    return this.cartItems().find(item => item.id === itemId);
  }

  isInCart(productId: string, color?: string, size?: string): boolean {
    return this.cartItems().some(item => 
      item.productId === productId && 
      item.color === color && 
      item.size === size
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadCartFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          this.cartItems.set(parsedCart);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }

  private saveCartToStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cartItems()));
    }
  }
}