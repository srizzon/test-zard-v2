import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

import { ProductService } from '../shared/services/product.service';
import { CartService } from '../shared/services/cart.service';
import { Product, Review } from '../shared/interfaces/ecommerce.interface';

import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardBreadcrumbModule } from '@shared/components/breadcrumb/breadcrumb.module';
import { ZardTabGroupComponent, ZardTabComponent } from '@shared/components/tabs/tabs.component';
import { ZardAccordionComponent } from '@shared/components/accordion/accordion.component';
import { ZardAccordionItemComponent } from '@shared/components/accordion/accordion-item.component';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { ZardAlertComponent } from '@shared/components/alert/alert.component';
import { ZardProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardInputDirective,
    ZardBreadcrumbModule,
    ZardTabGroupComponent,
    ZardTabComponent,
    ZardAccordionComponent,
    ZardAccordionItemComponent,
    ZardDividerComponent,
    ZardAlertComponent,
    ZardProgressBarComponent
  ],
  template: `
      @if (product()) {
        <div class="container mx-auto px-6 py-8">
          <!-- Breadcrumb Navigation -->
          <z-breadcrumb class="mb-6">
            <z-breadcrumb-list>
              <z-breadcrumb-item>
                <z-breadcrumb-link routerLink="/shop">Home</z-breadcrumb-link>
              </z-breadcrumb-item>
              <z-breadcrumb-separator />
              <z-breadcrumb-item>
                <z-breadcrumb-link routerLink="/shop/products">Products</z-breadcrumb-link>
              </z-breadcrumb-item>
              <z-breadcrumb-separator />
              <z-breadcrumb-item>
                <z-breadcrumb-link [routerLink]="['/shop/products']" [queryParams]="{category: product()!.category}">
                  {{ product()!.category }}
                </z-breadcrumb-link>
              </z-breadcrumb-item>
              <z-breadcrumb-separator />
              <z-breadcrumb-item>
                <z-breadcrumb-page>{{ product()!.name }}</z-breadcrumb-page>
              </z-breadcrumb-item>
            </z-breadcrumb-list>
          </z-breadcrumb>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <!-- Product Images -->
            <div class="space-y-4">
              <div class="aspect-square relative overflow-hidden rounded-lg border">
                <img
                  [src]="selectedImage()"
                  [alt]="product()!.name"
                  class="w-full h-full object-cover"
                />
                @if (product()!.isSale) {
                  <z-badge class="absolute top-4 left-4 bg-red-500">Sale</z-badge>
                }
                @if (product()!.isNew) {
                  <z-badge class="absolute top-4 right-4 bg-green-500">New</z-badge>
                }
              </div>

              <!-- Image Thumbnails -->
              @if (product()!.images.length > 1) {
                <div class="flex gap-2 overflow-x-auto">
                  @for (image of product()!.images; track image; let i = $index) {
                    <button
                      class="flex-shrink-0 w-20 h-20 rounded-md border overflow-hidden"
                      [class.border-primary]="selectedImage() === image"
                      [class.border-muted]="selectedImage() !== image"
                      (click)="selectImage(image)"
                    >
                      <img [src]="image" [alt]="product()!.name" class="w-full h-full object-cover" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Product Info -->
            <div class="space-y-6">
              <div>
                <p class="text-sm text-muted-foreground mb-2">{{ product()!.brand }}</p>
                <h1 class="text-3xl font-bold mb-4">{{ product()!.name }}</h1>

                <!-- Rating -->
                <div class="flex items-center space-x-2 mb-4">
                  <div class="flex items-center">
                    @for (star of [1,2,3,4,5]; track star) {
                      <svg class="w-5 h-5"
                           [class.text-yellow-400]="star <= product()!.rating"
                           [class.text-muted-foreground]="star > product()!.rating"
                           fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    }
                  </div>
                  <span class="text-sm text-muted-foreground">({{ product()!.reviewCount }} reviews)</span>
                </div>

                <!-- Price -->
                <div class="flex items-baseline space-x-3 mb-6">
                  <span class="text-3xl font-bold">{{ '$' + product()!.price }}</span>
                  @if (product()?.originalPrice && product()!.originalPrice! > product()!.price) {
                    <span class="text-xl text-muted-foreground line-through">{{ '$' + product()!.originalPrice }}</span>
                    <z-badge zType="destructive">{{ getDiscountPercentage() }}% OFF</z-badge>
                  }
                </div>

                <!-- Stock Status -->
                @if (product()!.inStock) {
                  <z-badge zType="outline" class="mb-6">✓ In Stock</z-badge>
                } @else {
                  <div class="mb-6">
                    <z-alert
                      zType="warning"
                      zTitle="Currently Out of Stock"
                      zDescription="This product is temporarily unavailable. You can add it to your wishlist to be notified when it's back in stock."
                    />
                  </div>
                }
              </div>

              <!-- Description -->
              <div>
                <h3 class="font-semibold mb-2">Description</h3>
                <p class="text-muted-foreground leading-relaxed">{{ product()!.description }}</p>
              </div>

              <!-- Colors -->
              @if (product()!.colors.length > 0) {
                <div>
                  <h3 class="font-semibold mb-3">Color</h3>
                  <div class="flex gap-2">
                    @for (color of product()!.colors; track color) {
                      <button
                        class="w-10 h-10 rounded-full border-2 relative"
                        [style.background-color]="getColorValue(color)"
                        [class.border-primary]="selectedColor() === color"
                        [class.border-muted]="selectedColor() !== color"
                        (click)="selectColor(color)"
                      >
                        @if (selectedColor() === color) {
                          <i class="icon-check absolute inset-0 m-auto text-white text-base"></i>
                        }
                      </button>
                    }
                  </div>
                  <p class="text-sm text-muted-foreground mt-1 capitalize">{{ selectedColor() }}</p>
                </div>
              }

              <!-- Sizes -->
              @if (product()!.sizes.length > 0) {
                <div>
                  <h3 class="font-semibold mb-3">Size</h3>
                  <z-select [(ngModel)]="selectedSize" placeholder="Select Size" size="default">
                    @for (size of product()!.sizes; track size) {
                      <z-select-item [value]="size">{{ size }}</z-select-item>
                    }
                  </z-select>
                </div>
              }

              <!-- Quantity -->
              <div>
                <h3 class="font-semibold mb-3">Quantity</h3>
                <div class="flex items-center space-x-3">
                  <button z-button zType="outline" zSize="icon" zShape="default" (click)="decreaseQuantity()" [disabled]="quantity() <= 1">
                    <i class="icon-minus text-base"></i>
                  </button>
                  <input
                    z-input
                    zSize="default"
                    type="number"
                    [value]="quantity()"
                    (input)="updateQuantity($event)"
                    min="1"
                    class="w-20 text-center"
                  />
                  <button z-button zType="outline" zSize="icon" zShape="default" (click)="increaseQuantity()">
                    <i class="icon-plus text-base"></i>
                  </button>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <button
                  z-button
                  zFull="true"
                  zSize="lg"
                  [disabled]="!product()!.inStock"
                  (click)="addToCart()"
                >
                  @if (product()!.inStock) {
                    Add to Cart - {{ '$' + getTotalPrice() }}
                  } @else {
                    Notify When Available
                  }
                </button>

                <div class="flex gap-3">
                  <button z-button zType="outline" zFull="true" (click)="addToWishlist()">
                    <i class="icon-heart mr-2 text-base"></i>
                    Wishlist
                  </button>
                  <button z-button zType="outline" zFull="true" (click)="shareProduct()">
                    <i class="icon-share-2 mr-2 text-base"></i>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Details Tabs -->
          <z-card>
            <z-tab-group>
              <z-tab label="Details">
                <div class="mt-6 space-y-4">
                  @if (product()?.features && product()!.features!.length > 0) {
                    <div>
                      <h3 class="font-semibold mb-3">Key Features</h3>
                      <ul class="list-disc list-inside space-y-1 text-muted-foreground">
                        @for (feature of product()!.features; track feature) {
                          <li>{{ feature }}</li>
                        }
                      </ul>
                    </div>
                  }

                  @if (product()!.specifications) {
                    <div>
                      <h3 class="font-semibold mb-3">Specifications</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        @for (spec of getSpecifications(); track spec.key) {
                          <div class="flex justify-between py-2 border-b border-muted">
                            <span class="font-medium">{{ spec.key }}</span>
                            <span class="text-muted-foreground">{{ spec.value }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              </z-tab>

              <z-tab label="Reviews ({{ product()!.reviewCount }})">
                <div class="mt-6 space-y-6">
                  <!-- Review Summary -->
                  <div class="flex items-center space-x-6">
                    <div class="text-center">
                      <div class="text-3xl font-bold">{{ product()!.rating.toFixed(1) }}</div>
                      <div class="flex items-center justify-center mt-1">
                        @for (star of [1,2,3,4,5]; track star) {
                          <i class="icon-star text-base"
                             [class.text-yellow-400]="star <= product()!.rating"
                             [class.text-muted-foreground]="star > product()!.rating">
                          </i>
                        }
                      </div>
                      <div class="text-sm text-muted-foreground mt-1">{{ product()!.reviewCount }} reviews</div>
                    </div>

                    <div class="flex-1">
                      @for (rating of [5,4,3,2,1]; track rating) {
                        <div class="flex items-center space-x-2 mb-1">
                          <span class="text-sm w-8">{{ rating }}★</span>
                          <div class="flex-1">
                            <z-progress-bar 
                              [progress]="getRatingPercentage(rating)" 
                              zSize="sm"
                              class="bg-muted"
                            />
                          </div>
                          <span class="text-sm text-muted-foreground w-8">{{ getRatingCount(rating) }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <z-divider />

                  <!-- Individual Reviews -->
                  <div class="space-y-6">
                    @for (review of reviews(); track review.id) {
                      <div class="space-y-3">
                        <div class="flex items-start justify-between">
                          <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span class="font-semibold text-primary">{{ getInitials(review.userName) }}</span>
                            </div>
                            <div>
                              <div class="flex items-center space-x-2">
                                <span class="font-medium">{{ review.userName }}</span>
                                @if (review.verified) {
                                  <z-badge zType="outline" class="text-xs">Verified Purchase</z-badge>
                                }
                              </div>
                              <div class="flex items-center space-x-2 mt-1">
                                <div class="flex">
                                  @for (star of [1,2,3,4,5]; track star) {
                                    <i class="icon-star text-base"
                                       [class.text-yellow-400]="star <= review.rating"
                                       [class.text-muted-foreground]="star > review.rating">
                                    </i>
                                  }
                                </div>
                                <span class="text-sm text-muted-foreground">{{ review.date | date:'short' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p class="text-muted-foreground leading-relaxed">{{ review.comment }}</p>
                      </div>
                      @if (!$last) {
                        <z-divider />
                      }
                    }
                  </div>
                </div>
              </z-tab>

              <z-tab label="Shipping & Returns">
                <div class="mt-6 space-y-6">
                  <z-accordion zType="multiple" [zDefaultValue]="['shipping', 'returns']">
                    <z-accordion-item zValue="shipping" zTitle="Shipping Information">
                      <div class="space-y-3 text-muted-foreground">
                        <p>• Free standard shipping on orders over $50</p>
                        <p>• Express shipping available for $9.99</p>
                        <p>• Standard delivery: 3-7 business days</p>
                        <p>• Express delivery: 1-2 business days</p>
                        <p>• International shipping available to select countries</p>
                      </div>
                    </z-accordion-item>

                    <z-accordion-item zValue="returns" zTitle="Return Policy">
                      <div class="space-y-3 text-muted-foreground">
                        <p>• 30-day return policy on all items</p>
                        <p>• Items must be in original condition with tags attached</p>
                        <p>• Free returns for defective or damaged items</p>
                        <p>• Return shipping costs may apply for exchanges</p>
                        <p>• Refunds processed within 5-10 business days</p>
                      </div>
                    </z-accordion-item>

                    <z-accordion-item zValue="warranty" zTitle="Warranty">
                      <div class="space-y-3 text-muted-foreground">
                        <p>• 1-year manufacturer warranty included</p>
                        <p>• Covers defects in materials and workmanship</p>
                        <p>• Extended warranty options available</p>
                        <p>• Customer support available 24/7</p>
                      </div>
                    </z-accordion-item>
                  </z-accordion>
                </div>
              </z-tab>
            </z-tab-group>
          </z-card>
        </div>
      } @else {
        <div class="container mx-auto px-6 py-8">
          <z-card>
            <div class="text-center py-12">
              <h1 class="text-2xl font-bold mb-4">Product Not Found</h1>
              <p class="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <button z-button routerLink="/products">Back to Products</button>
            </div>
          </z-card>
        </div>
      }
  `
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private activatedRoute = inject(ActivatedRoute);

  // State
  product = signal<Product | null>(null);
  selectedImage = signal('');
  selectedColor = signal('');
  selectedSize = signal('');
  quantity = signal(1);

  // Get reviews from service
  reviews = computed(() => {
    const productId = this.product()?.id;
    return productId ? this.productService.getProductReviews(productId) : [];
  });

  constructor() {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const productId = params['id'] || '1';
      this.loadProduct(productId);
    });
  }

  private loadProduct(id: string) {
    const foundProduct = this.productService.getProduct(id);
    if (foundProduct) {
      this.product.set(foundProduct);
      this.selectedImage.set(foundProduct.images[0]);
      if (foundProduct.colors.length > 0) {
        this.selectedColor.set(foundProduct.colors[0]);
      }
    }
  }


  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  selectColor(color: string) {
    this.selectedColor.set(color);
  }

  increaseQuantity() {
    this.quantity.update(q => q + 1);
  }

  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  updateQuantity(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    if (value && value > 0) {
      this.quantity.set(value);
    }
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
      'silver': '#c0c0c0',
      'brown': '#8b4513',
      'tan': '#d2b48c',
      'burgundy': '#800020',
      'cream': '#f5f5dc',
      'terracotta': '#e2725b'
    };
    return colorMap[color] || '#6b7280';
  }

  getDiscountPercentage(): number {
    const product = this.product();
    if (!product || !product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  getTotalPrice(): number {
    const product = this.product();
    return product ? product.price * this.quantity() : 0;
  }

  getSpecifications(): Array<{key: string, value: string}> {
    const product = this.product();
    if (!product?.specifications) return [];
    return Object.entries(product.specifications).map(([key, value]) => ({ key, value }));
  }

  getRatingPercentage(rating: number): number {
    const product = this.product();
    if (!product) return 0;
    // Mock percentage calculation
    const percentages: { [key: number]: number } = { 5: 65, 4: 20, 3: 10, 2: 3, 1: 2 };
    return percentages[rating] || 0;
  }

  getRatingCount(rating: number): number {
    const product = this.product();
    if (!product) return 0;
    // Mock count calculation
    const counts: { [key: number]: number } = { 5: 83, 4: 26, 3: 13, 2: 4, 1: 2 };
    return counts[rating] || 0;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product, {
        color: this.selectedColor(),
        size: this.selectedSize(),
        quantity: this.quantity()
      });
    }
  }

  addToWishlist() {
    const product = this.product();
    if (product) {
      toast.success(`${product.name} added to wishlist!`, {
        description: 'You can view your wishlist items later',
        duration: 3000,
      });
    }
  }

  shareProduct() {
    if (navigator.share) {
      navigator.share({
        title: this.product()?.name,
        text: this.product()?.description,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!', {
        description: 'Share this link with friends and family',
        duration: 3000,
      });
    }
  }
}
