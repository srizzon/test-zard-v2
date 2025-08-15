import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';

import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { ZardAlertComponent } from '@shared/components/alert/alert.component';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardDividerComponent,
    ZardAlertComponent
  ],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div class="max-w-2xl w-full space-y-8">
        <!-- Success Card -->
        <z-card class="text-center">
          <div class="py-12 px-6">
            <!-- Success Icon -->
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>

            <!-- Success Message -->
            <h1 class="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p class="text-muted-foreground mb-8 text-lg">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>

            <!-- Order Details -->
            <div class="bg-muted/20 rounded-lg p-6 mb-8">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-muted-foreground mb-1">Order Number</p>
                  <p class="font-mono font-bold text-lg">#{{ orderNumber }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground mb-1">Order Date</p>
                  <p class="font-medium">{{ orderDate.toLocaleDateString() }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground mb-1">Estimated Delivery</p>
                  <p class="font-medium">{{ estimatedDelivery.toLocaleDateString() }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground mb-1">Status</p>
                  <z-badge zType="default" class="bg-green-600 text-white hover:bg-green-700">Confirmed</z-badge>
                </div>
              </div>
            </div>
          </div>
        </z-card>

        <!-- Next Steps -->
        <z-card zTitle="What's Next?">
          <div class="space-y-4 mt-6">
            <z-alert
              zType="info"
              zTitle="Confirmation Email Sent"
              zDescription="A confirmation email with your order details has been sent to your email address."
            />
            
            <z-divider />
            
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 class="font-medium">Order Processing</h4>
                  <p class="text-sm text-muted-foreground">We'll prepare your items for shipment</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h4 class="font-medium">Shipping Notification</h4>
                  <p class="text-sm text-muted-foreground">You'll receive tracking information via email</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h4 class="font-medium">Delivery</h4>
                  <p class="text-sm text-muted-foreground">Expected by {{ estimatedDelivery.toLocaleDateString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </z-card>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button z-button zType="outline" zFull="true" routerLink="/shop/products">
            <i class="icon-shopping-bag mr-2 text-base"></i>
            Continue Shopping
          </button>
          <button z-button zFull="true" routerLink="/dashboard">
            <i class="icon-user mr-2 text-base"></i>
            View Account
          </button>
          <button z-button zType="outline" zFull="true" (click)="trackOrder()">
            <i class="icon-truck mr-2 text-base"></i>
            Track Order
          </button>
        </div>
      </div>
    </div>
  `
})
export class OrderSuccessComponent {
  orderNumber = this.generateOrderNumber();
  orderDate = new Date();
  estimatedDelivery = this.calculateEstimatedDelivery();

  private generateOrderNumber(): string {
    return 'ORD-' + Date.now().toString().slice(-8);
  }

  private calculateEstimatedDelivery(): Date {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 5); // 5 days from now
    return delivery;
  }

  trackOrder(): void {
    toast.info('Order tracking', {
      description: 'You will receive tracking information via email once your order ships.',
      duration: 4000,
    });
  }
}