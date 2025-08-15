import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { ZardBreadcrumbModule } from '@shared/components/breadcrumb/breadcrumb.module';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { ZardCheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { ZardRadioComponent } from '@shared/components/radio/radio.component';

import { CartService } from '../shared/services/cart.service';
import { CartItem, ShippingOption } from '../shared/interfaces/ecommerce.interface';

interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple-pay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardInputDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardBreadcrumbModule,
    ZardDividerComponent,
    ZardCheckboxComponent,
    ZardRadioComponent
  ],
  template: `
    <div class="container mx-auto px-6 py-8">
        @if (cartService.items().length === 0) {
          <!-- Empty Cart -->
          <z-card>
            <div class="text-center py-12">
              <i class="icon-shopping-cart text-6xl text-muted-foreground mb-6 block"></i>
              <h2 class="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p class="text-muted-foreground mb-6">Add some products to your cart before checking out.</p>
              <button z-button zType="default" zSize="lg" routerLink="/shop/products">
                <i class="icon-arrow-left mr-2 text-base"></i>
                Continue Shopping
              </button>
            </div>
          </z-card>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Checkout Form -->
            <div class="lg:col-span-2 space-y-8">
              <div>
                <h1 class="text-3xl font-bold mb-2">Checkout</h1>
                <p class="text-muted-foreground">Complete your order information below</p>
              </div>

              <!-- Contact Information -->
              <z-card zTitle="Contact Information">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label class="text-sm font-medium mb-2 block">Email *</label>
                    <input
                      z-input
                      zSize="default"
                      type="email"
                      placeholder="your@email.com"
                      [(ngModel)]="billingAddress().email"
                      required
                    />
                  </div>
                  <div>
                    <label class="text-sm font-medium mb-2 block">Phone *</label>
                    <input
                      z-input
                      zSize="default"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      [(ngModel)]="billingAddress().phone"
                      required
                    />
                  </div>
                </div>
              </z-card>

              <!-- Shipping Address -->
              <z-card zTitle="Shipping Address">
                <div class="space-y-4 mt-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="text-sm font-medium mb-2 block">First Name *</label>
                      <input
                        z-input
                        zSize="default"
                        type="text"
                        placeholder="John"
                        [(ngModel)]="billingAddress().firstName"
                        required
                      />
                    </div>
                    <div>
                      <label class="text-sm font-medium mb-2 block">Last Name *</label>
                      <input
                        z-input
                        zSize="default"
                        type="text"
                        placeholder="Doe"
                        [(ngModel)]="billingAddress().lastName"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-sm font-medium mb-2 block">Address *</label>
                    <input
                      z-input
                      zSize="default"
                      type="text"
                      placeholder="123 Main Street"
                      [(ngModel)]="billingAddress().address"
                      required
                    />
                  </div>

                  <div>
                    <label class="text-sm font-medium mb-2 block">Apartment, suite, etc. (optional)</label>
                    <input
                      z-input
                      zSize="default"
                      type="text"
                      placeholder="Apt 1A"
                      [(ngModel)]="billingAddress().apartment"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label class="text-sm font-medium mb-2 block">City *</label>
                      <input
                        z-input
                        zSize="default"
                        type="text"
                        placeholder="New York"
                        [(ngModel)]="billingAddress().city"
                        required
                      />
                    </div>
                    <div>
                      <label class="text-sm font-medium mb-2 block">State *</label>
                      <z-select [(ngModel)]="billingAddress().state" placeholder="Select State">
                        @for (state of states; track state.code) {
                          <z-select-item [value]="state.code">{{ state.name }}</z-select-item>
                        }
                      </z-select>
                    </div>
                    <div>
                      <label class="text-sm font-medium mb-2 block">ZIP Code *</label>
                      <input
                        z-input
                        zSize="default"
                        type="text"
                        placeholder="12345"
                        [(ngModel)]="billingAddress().zipCode"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label class="text-sm font-medium mb-2 block">Country *</label>
                    <z-select [(ngModel)]="billingAddress().country" placeholder="Select Country">
                      @for (country of countries; track country.code) {
                        <z-select-item [value]="country.code">{{ country.name }}</z-select-item>
                      }
                    </z-select>
                  </div>
                </div>
              </z-card>

              <!-- Shipping Method -->
              <z-card zTitle="Shipping Method">
                <div class="space-y-3 mt-6">
                  @for (option of shippingOptions(); track option.id) {
                    <label
                      class="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                      [class.border-primary]="selectedShipping() === option.id">
                      <z-radio
                        name="shipping"
                        [value]="option.id"
                        [(ngModel)]="selectedShipping"
                      />
                      <div class="flex-1">
                        <div class="flex justify-between items-center">
                          <span class="font-medium">{{ option.name }}</span>
                          <span class="font-bold">{{ option.price === 0 ? 'Free' : '$' + option.price.toFixed(2) }}</span>
                        </div>
                        <p class="text-sm text-muted-foreground">{{ option.description }}</p>
                        <p class="text-sm text-muted-foreground">{{ option.estimatedDays }}</p>
                      </div>
                    </label>
                  }
                </div>
              </z-card>

              <!-- Payment Method -->
              <z-card zTitle="Payment Method">
                <div class="space-y-6 mt-6">
                  <!-- Payment Type Selection -->
                  <div class="space-y-3">
                    @for (type of paymentTypes; track type.id) {
                      <label
                        class="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                        [class.border-primary]="paymentMethod().type === type.id">
                        <z-radio
                          name="paymentType"
                          [value]="type.id"
                          [(ngModel)]="paymentMethodType"
                          (radioChange)="onPaymentTypeChange(type.id)"
                        />
                        <i [class]="type.icon + ' text-xl'"></i>
                        <span class="font-medium">{{ type.name }}</span>
                      </label>
                    }
                  </div>

                  <!-- Credit Card Form -->
                  @if (paymentMethod().type === 'card') {
                    <div class="space-y-4 p-4 border rounded-lg bg-muted/20">
                      <div>
                        <label class="text-sm font-medium mb-2 block">Cardholder Name *</label>
                        <input
                          z-input
                          zSize="default"
                          type="text"
                          placeholder="John Doe"
                          [(ngModel)]="cardholderName"
                          required
                        />
                      </div>
                      <div>
                        <label class="text-sm font-medium mb-2 block">Card Number *</label>
                        <input
                          z-input
                          zSize="default"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          [(ngModel)]="cardNumber"
                          required
                        />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="text-sm font-medium mb-2 block">Expiry Date *</label>
                          <input
                            z-input
                            zSize="default"
                            type="text"
                            placeholder="MM/YY"
                            [(ngModel)]="expiryDate"
                            required
                          />
                        </div>
                        <div>
                          <label class="text-sm font-medium mb-2 block">CVV *</label>
                          <input
                            z-input
                            zSize="default"
                            type="text"
                            placeholder="123"
                            [(ngModel)]="cvv"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </z-card>

              <!-- Billing Address -->
              <z-card zTitle="Billing Address">
                <div class="mt-6">
                  <z-checkbox [(ngModel)]="sameAsShipping" (checkChange)="toggleSameAsShipping()">
                    Same as shipping address
                  </z-checkbox>

                  @if (!sameAsShipping()) {
                    <div class="space-y-4 mt-4">
                      <p class="text-sm text-muted-foreground">Enter your billing address details</p>
                      <!-- Billing address form (similar to shipping) -->
                    </div>
                  }
                </div>
              </z-card>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <z-card zTitle="Order Summary" class="sticky top-8">
                <div class="space-y-4 mt-6">
                  <!-- Order Items -->
                  <div class="space-y-4">
                    @for (item of cartService.items(); track item.id) {
                      <div class="flex items-center space-x-3">
                        <div class="relative">
                          <img
                            [src]="item.image"
                            [alt]="item.name"
                            class="w-16 h-16 object-cover rounded-lg"
                          />
                          <z-badge class="absolute -top-2 -right-2 min-w-6 h-6 flex items-center justify-center text-xs">
                            {{ item.quantity }}
                          </z-badge>
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="font-medium line-clamp-1">{{ item.name }}</h4>
                          <p class="text-sm text-muted-foreground">{{ item.brand }}</p>
                          @if (item.color || item.size) {
                            <div class="text-xs text-muted-foreground">
                              @if (item.color) {
                                <span class="capitalize">{{ item.color }}</span>
                              }
                              @if (item.color && item.size) {
                                <span> / </span>
                              }
                              @if (item.size) {
                                <span>{{ item.size }}</span>
                              }
                            </div>
                          }
                        </div>
                        <div class="text-right">
                          <div class="font-medium">{{ '$' + (item.price * item.quantity).toFixed(2) }}</div>
                        </div>
                      </div>
                    }
                  </div>

                  <z-divider />

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

                  <!-- Price Breakdown -->
                  <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                      <span>Subtotal ({{ cartService.totalItems() }} items)</span>
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

                  <!-- Place Order Button -->
                  <button
                    z-button
                    zFull="true"
                    zSize="lg"
                    [disabled]="!isFormValid() || isProcessing()"
                    (click)="placeOrder()"
                  >
                    @if (isProcessing()) {
                      <i class="icon-loader mr-2 text-base animate-spin"></i>
                      Processing...
                    } @else {
                      <i class="icon-lock mr-2 text-base"></i>
                      Place Order - {{ '$' + total().toFixed(2) }}
                    }
                  </button>

                  <!-- Security Badge -->
                  <div class="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <i class="icon-shield text-base"></i>
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                </div>
              </z-card>
            </div>
          </div>
        }
    </div>
  `
})
export class CheckoutComponent {
  protected cartService = inject(CartService);
  private router = inject(Router);

  // Form states
  billingAddress = signal<BillingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  paymentMethodType = signal<'card' | 'paypal' | 'apple-pay'>('card');
  cardholderName = signal('');
  cardNumber = signal('');
  expiryDate = signal('');
  cvv = signal('');

  selectedShipping = signal('standard');
  sameAsShipping = signal(true);
  promoCode = signal('');
  appliedPromo = signal('');
  isProcessing = signal(false);

  // Shipping options
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

  // Static data
  states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' }
  ];

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'MX', name: 'Mexico' }
  ];

  paymentTypes = [
    { id: 'card' as const, name: 'Credit/Debit Card', icon: 'icon-credit-card' },
    { id: 'paypal' as const, name: 'PayPal', icon: 'icon-paypal' },
    { id: 'apple-pay' as const, name: 'Apple Pay', icon: 'icon-apple' }
  ];

  // Computed values
  paymentMethod = computed(() => ({
    type: this.paymentMethodType(),
    cardNumber: this.cardNumber(),
    expiryDate: this.expiryDate(),
    cvv: this.cvv(),
    cardholderName: this.cardholderName()
  }));

  subtotal = computed(() => this.cartService.subtotal());

  discount = computed(() => {
    if (this.appliedPromo() === 'SAVE10') return this.subtotal() * 0.1;
    if (this.appliedPromo() === 'SAVE20') return this.subtotal() * 0.2;
    return 0;
  });

  shippingCost = computed(() => {
    const selectedOption = this.shippingOptions().find(opt => opt.id === this.selectedShipping());
    if (this.subtotal() >= 50 && selectedOption?.id === 'standard') return 0;
    return selectedOption?.price || 0;
  });

  tax = computed(() => (this.subtotal() - this.discount()) * 0.08);

  total = computed(() =>
    this.subtotal() - this.discount() + this.shippingCost() + this.tax()
  );

  isFormValid = computed(() => {
    const billing = this.billingAddress();
    const isAddressValid = billing.firstName && billing.lastName && billing.email &&
                          billing.phone && billing.address && billing.city &&
                          billing.state && billing.zipCode && billing.country;

    if (this.paymentMethodType() === 'card') {
      return isAddressValid && this.cardholderName() && this.cardNumber() &&
             this.expiryDate() && this.cvv();
    }

    return isAddressValid;
  });

  onPaymentTypeChange(type: 'card' | 'paypal' | 'apple-pay') {
    this.paymentMethodType.set(type);
  }

  toggleSameAsShipping() {
    // Implementation for billing address toggle
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

  async placeOrder() {
    if (!this.isFormValid()) {
      toast.error('Please complete all required fields', {
        description: 'Check your shipping address and payment information',
        duration: 4000,
      });
      return;
    }

    this.isProcessing.set(true);
    
    const processingToast = toast.loading('Processing your order...', {
      description: 'Please wait while we process your payment',
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Order placed successfully!', {
        id: processingToast,
        description: 'Thank you for your purchase. You will receive a confirmation email shortly.',
        duration: 4000,
      });

      // Clear cart and redirect to success page
      setTimeout(() => {
        this.cartService.clearCart();
        this.router.navigate(['/shop/order-success']);
      }, 1000);
    } catch (error) {
      toast.error('Order failed', {
        id: processingToast,
        description: 'There was an error processing your order. Please try again.',
        duration: 4000,
      });
      console.error('Order failed:', error);
    } finally {
      this.isProcessing.set(false);
    }
  }
}
