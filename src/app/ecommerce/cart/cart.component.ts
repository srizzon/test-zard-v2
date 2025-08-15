import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

import { CartService } from '../shared/services/cart.service';
import { CartItem, ShippingOption } from '../shared/interfaces/ecommerce.interface';

import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardBreadcrumbModule } from '@shared/components/breadcrumb/breadcrumb.module';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { ZardAlertDialogService } from '@shared/components/alert-dialog/alert-dialog.service';
import { ZardAlertComponent } from '@shared/components/alert/alert.component';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardInputDirective,
    ZardBreadcrumbModule,
    ZardDividerComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardAlertComponent
  ],
  template: `
    <div class="container mx-auto px-6 py-8">
        @if (cartItems().length === 0) {
          <!-- Empty Cart -->
          <z-card>
            <div class="text-center py-12">
              <i class="icon-shopping-cart text-6xl text-muted-foreground mb-6 block"></i>
              <h2 class="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p class="text-muted-foreground mb-6">Add some products to your cart to continue shopping.</p>
              <button z-button zType="default" zSize="lg" routerLink="/shop/products">
                <i class="icon-arrow-left mr-2 text-base"></i>
                Continue Shopping
              </button>
            </div>
          </z-card>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-2 space-y-6">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 class="text-3xl font-bold">Shopping Cart</h1>
                  <span class="text-muted-foreground">{{ cartItems().length }} {{ cartItems().length === 1 ? 'item' : 'items' }}</span>
                </div>

                <!-- Sort Select -->
                <z-select [(ngModel)]="sortOrder" (selectionChange)="sortCartItems()" placeholder="Sort by" class="min-w-48">
                  <z-select-item value="default" label="Default Order" />
                  <z-select-item value="name-asc" label="Name (A-Z)" />
                  <z-select-item value="name-desc" label="Name (Z-A)" />
                  <z-select-item value="price-asc" label="Price (Low to High)" />
                  <z-select-item value="price-desc" label="Price (High to Low)" />
                  <z-select-item value="quantity-asc" label="Quantity (Low to High)" />
                  <z-select-item value="quantity-desc" label="Quantity (High to Low)" />
                </z-select>
              </div>

              <!-- Cart Items List -->
              <div class="space-y-4">
                @for (item of cartItems(); track item.id) {
                  <z-card class="overflow-hidden">
                    <div class="flex gap-4 p-4">
                      <!-- Product Image -->
                      <div class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          [src]="item.image"
                          [alt]="item.name"
                          class="w-full h-full object-cover"
                        />
                      </div>

                      <!-- Product Details -->
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start">
                          <div>
                            <h3 class="font-medium line-clamp-1">{{ item.name }}</h3>
                            <p class="text-sm text-muted-foreground">{{ item.brand }}</p>

                            <!-- Variants -->
                            <div class="flex gap-3 mt-2">
                              @if (item.color) {
                                <span class="text-xs text-muted-foreground">Color: <span class="capitalize">{{ item.color }}</span></span>
                              }
                              @if (item.size) {
                                <span class="text-xs text-muted-foreground">Size: {{ item.size }}</span>
                              }
                            </div>

                            @if (!item.inStock) {
                              <z-badge zType="destructive" class="mt-2">Out of Stock</z-badge>
                            }
                          </div>

                          <!-- Remove Button -->
                          <button
                            z-button
                            zType="ghost"
                            zSize="icon"
                            zShape="circle"
                            (click)="removeFromCart(item.id)"
                            class="text-muted-foreground hover:text-destructive"
                          >
                            <i class="icon-trash-2 text-base"></i>
                          </button>
                        </div>

                        <!-- Price and Quantity -->
                        <div class="flex items-center justify-between mt-4">
                          <!-- Quantity Controls -->
                          <div class="flex items-center space-x-2">
                            <span class="text-sm text-muted-foreground">Qty:</span>
                            <div class="flex items-center border rounded-md">
                              <button
                                z-button
                                zType="ghost"
                                zSize="sm"
                                class="px-2 h-8 border-r"
                                (click)="decreaseQuantity(item.id)"
                                [disabled]="item.quantity <= 1"
                              >
                                <i class="icon-minus text-sm"></i>
                              </button>
                              <span class="px-3 py-1 text-sm min-w-[3rem] text-center">{{ item.quantity }}</span>
                              <button
                                z-button
                                zType="ghost"
                                zSize="sm"
                                class="px-2 h-8 border-l"
                                (click)="increaseQuantity(item.id)"
                              >
                                <i class="icon-plus text-sm"></i>
                              </button>
                            </div>
                          </div>

                          <!-- Price -->
                          <div class="text-right">
                            <div class="font-bold">{{ '$' + (item.price * item.quantity).toFixed(2) }}</div>
                            @if (item.originalPrice && item.originalPrice > item.price) {
                              <div class="text-sm text-muted-foreground line-through">{{ '$' + (item.originalPrice * item.quantity).toFixed(2) }}</div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </z-card>
                }
              </div>

              <!-- Cart Actions -->
              <div class="flex flex-col sm:flex-row gap-4 justify-between">
                <button z-button zType="outline" zSize="default" routerLink="/products">
                  <i class="icon-arrow-left mr-2 text-base"></i>
                  Continue Shopping
                </button>

                @if (cartItems().length > 0) {
                  <button z-button zType="outline" zSize="default" (click)="confirmClearCart()" class="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <i class="icon-trash-2 mr-2 text-base"></i>
                    Clear Cart
                  </button>
                }
              </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <z-card zTitle="Order Summary" class="sticky top-8">
                <div class="space-y-4 mt-6">
                  <!-- Promo Code -->
                  <div>
                    <label class="text-sm font-medium mb-2 block">Promo Code</label>
                    <div class="flex gap-2">
                      <input
                        z-input
                        zSize="default"
                        type="text"
                        placeholder="Enter code"
                        [(ngModel)]="promoCode"
                        class="flex-1"
                      />
                      <button z-button zType="secondary" zSize="default" (click)="applyPromoCode()">Apply</button>
                    </div>
                    @if (appliedPromo()) {
                      <z-badge zType="default" class="mt-2 w-full justify-between">
                        <span><i class="icon-check mr-1 text-sm"></i> {{ appliedPromo() }} applied</span>
                        <button z-button zType="ghost" zSize="sm" (click)="removePromo()">
                          <i class="icon-x text-sm"></i>
                        </button>
                      </z-badge>
                    }
                  </div>

                  <z-divider />

                  <!-- Shipping Options -->
                  <div>
                    <label class="text-sm font-medium mb-3 block">Shipping</label>
                    <div class="space-y-2">
                      @for (option of shippingOptions(); track option.id) {
                        <label
                          class="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                          [class.border-primary]="selectedShipping() === option.id">
                          <input
                            type="radio"
                            name="shipping"
                            [value]="option.id"
                            [(ngModel)]="selectedShipping"
                            class="sr-only"
                          />
                          <div class="w-4 h-4 border rounded-full flex items-center justify-center"
                               [class.border-primary]="selectedShipping() === option.id">
                            @if (selectedShipping() === option.id) {
                              <div class="w-2 h-2 bg-primary rounded-full"></div>
                            }
                          </div>
                          <div class="flex-1">
                            <div class="flex justify-between items-center">
                              <span class="font-medium">{{ option.name }}</span>
                              <span class="font-bold">{{ option.price === 0 ? 'Free' : '$' + option.price.toFixed(2) }}</span>
                            </div>
                            <p class="text-xs text-muted-foreground">{{ option.description }}</p>
                            <p class="text-xs text-muted-foreground">{{ option.estimatedDays }}</p>
                          </div>
                        </label>
                      }
                    </div>
                  </div>

                  <z-divider />

                  <!-- Price Breakdown -->
                  <!-- Free Shipping Alert -->
                  @if (subtotal() >= 50 && selectedShipping() === 'standard') {
                    <z-alert
                      zType="success"
                      zTitle="Free Shipping!"
                      zDescription="You've qualified for free standard shipping on orders over $50."
                    />
                  } @else if (subtotal() < 50) {
                    <z-alert
                      zType="info"
                      zTitle="Almost there!"
                      [zDescription]="'Add $' + (50 - subtotal()).toFixed(2) + ' more to qualify for free shipping.'"
                    />
                  }

                  <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                      <span>Subtotal ({{ totalItems() }} items)</span>
                      <span>{{ '$' + subtotal().toFixed(2) }}</span>
                    </div>

                    @if (discount() > 0) {
                      <div class="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>{{ discount().toFixed(2) }}</span>
                      </div>
                     }

                    <div class="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{{ shippingCost() === 0 ? 'Free' : '$' + shippingCost().toFixed(2) }}</span>
                    </div>

                    <div class="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{{ '$' + tax().toFixed(2) }}</span>
                    </div>

                    <z-divider />

                    <div class="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{{ '$' + total().toFixed(2) }}</span>
                    </div>
                  </div>

                  <!-- Checkout Button -->
                  <button
                    z-button
                    [zType]="hasOutOfStockItems() ? 'destructive' : 'default'"
                    zFull="true"
                    zSize="lg"
                    [disabled]="hasOutOfStockItems() && cartItems().length === 0"
                    (click)="proceedToCheckout()"
                  >
                    @if (hasOutOfStockItems()) {
                      <i class="icon-alert-circle mr-2 text-base"></i>
                      Remove Out of Stock Items
                    } @else {
                      <i class="icon-arrow-right mr-2 text-base"></i>
                      Proceed to Checkout
                    }
                  </button>

                  @if (hasOutOfStockItems()) {
                    <p class="text-sm text-muted-foreground text-center">Some items in your cart are out of stock</p>
                  }

                  <!-- Security Badge -->
                  <div class="flex items-center justify-center space-x-2 text-xs text-muted-foreground mt-4">
                    <i class="icon-lock text-base"></i>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </z-card>
            </div>
          </div>
        }
    </div>
  `
})
export class CartComponent {
  private cartService = inject(CartService);
  private router = inject(Router);
  private alertDialog = inject(ZardAlertDialogService);

  // State
  promoCode = signal('');
  appliedPromo = signal('');
  selectedShipping = signal('standard');
  sortOrder = signal('default');

  // Get cart items from service
  cartItems = computed(() => this.cartService.items());

  shippingOptions = signal<ShippingOption[]>([
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 0,
      description: 'Free shipping on orders over $50',
      estimatedDays: '5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 9.99,
      description: 'Fast delivery',
      estimatedDays: '2-3 business days'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 24.99,
      description: 'Next day delivery',
      estimatedDays: '1 business day'
    }
  ]);

  // Computed values
  totalItems = computed(() => this.cartService.totalItems());
  subtotal = computed(() => this.cartService.subtotal());

  discount = computed(() => {
    if (this.appliedPromo() === 'SAVE10') return this.subtotal() * 0.1;
    if (this.appliedPromo() === 'SAVE20') return this.subtotal() * 0.2;
    return 0;
  });

  shippingCost = computed(() => {
    const selectedOption = this.shippingOptions().find(opt => opt.id === this.selectedShipping());
    // Free shipping on orders over $50
    if (this.subtotal() >= 50 && selectedOption?.id === 'standard') return 0;
    return selectedOption?.price || 0;
  });

  tax = computed(() => (this.subtotal() - this.discount()) * 0.08); // 8% tax

  total = computed(() =>
    this.subtotal() - this.discount() + this.shippingCost() + this.tax()
  );

  hasOutOfStockItems = computed(() =>
    this.cartItems().some(item => !item.inStock)
  );

  removeFromCart(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }

  increaseQuantity(itemId: string) {
    const item = this.cartService.getCartItem(itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: string) {
    const item = this.cartService.getCartItem(itemId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  applyPromoCode() {
    const code = this.promoCode().trim().toUpperCase();
    if (code === 'SAVE10' || code === 'SAVE20') {
      this.appliedPromo.set(code);
      this.promoCode.set('');
      const discount = code === 'SAVE10' ? '10%' : '20%';
      toast.success(`Promo code ${code} applied!`, {
        description: `You saved ${discount} on your order`,
        duration: 4000,
      });
    } else {
      toast.error('Invalid promo code', {
        description: 'Please check your promo code and try again',
        duration: 3000,
      });
    }
  }

  removePromo() {
    this.appliedPromo.set('');
  }

  proceedToCheckout() {
    if (this.hasOutOfStockItems()) {
      // Remove out of stock items
      const outOfStockItems = this.cartItems().filter(item => !item.inStock);
      outOfStockItems.forEach(item => this.cartService.removeFromCart(item.id));
    } else {
      // Navigate to checkout
      this.router.navigate(['/shop/checkout']);
    }
  }

  sortCartItems() {
    // For now, sorting is handled in the template
    // In a real implementation, you might want to add sorting to the cart service
    console.log('Sort order changed to:', this.sortOrder());
  }

  async confirmClearCart() {
    this.alertDialog.confirm({
      zTitle: 'Clear Cart',
      zDescription: `Are you sure you want to remove all ${this.cartItems().length} items from your cart? This action cannot be undone.`,
      zOkText: 'Clear Cart',
      zCancelText: 'Keep Items',
      zOkDestructive: true,
      zOnOk: () => {
        this.cartService.clearCart();
      }
    });
  }
}
