import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { ZardToastComponent } from '@shared/components/toast/toast.component';

import { CartService } from '../shared/services/cart.service';
import { WishlistService } from '../shared/services/wishlist.service';

@Component({
  selector: 'app-ecommerce-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ZardButtonComponent,
    ZardInputDirective,
    ZardBadgeComponent,
    ZardDropdownModule,
    ZardToastComponent
  ],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Ecommerce Header -->
      <header class="border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div class="container mx-auto px-6">
          <div class="flex items-center justify-between h-16">
            <!-- Logo and Navigation -->
            <div class="flex items-center space-x-8">
              <a routerLink="/shop" class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span class="font-bold text-lg">Zard Shop</span>
              </a>

              <!-- Navigation Links -->
              <nav class="hidden md:flex items-center space-x-6">
                <a routerLink="/shop/products" routerLinkActive="text-primary" class="text-sm font-medium hover:text-primary transition-colors">
                  Products
                </a>
                <z-dropdown-menu>
                  <button z-dropdown-trigger class="text-sm font-medium hover:text-primary transition-colors flex items-center">
                    Categories
                    <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <z-dropdown-menu-content>
                    <z-dropdown-menu-item routerLink="/shop/products?category=Electronics">Electronics</z-dropdown-menu-item>
                    <z-dropdown-menu-item routerLink="/shop/products?category=Clothing">Clothing</z-dropdown-menu-item>
                    <z-dropdown-menu-item routerLink="/shop/products?category=Home & Garden">Home & Garden</z-dropdown-menu-item>
                    <z-dropdown-menu-item routerLink="/shop/products?category=Kitchen">Kitchen</z-dropdown-menu-item>
                    <z-dropdown-menu-item routerLink="/shop/products?category=Accessories">Accessories</z-dropdown-menu-item>
                  </z-dropdown-menu-content>
                </z-dropdown-menu>
                <a href="#" class="text-sm font-medium hover:text-primary transition-colors">
                  Deals
                </a>
                <a href="#" class="text-sm font-medium hover:text-primary transition-colors">
                  About
                </a>
              </nav>
            </div>

            <!-- Search Bar -->
            <div class="hidden md:flex flex-1 max-w-md mx-8">
              <div class="relative w-full">
                <svg class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input 
                  z-input 
                  class="pl-9 pr-4 w-full" 
                  type="search" 
                  placeholder="Search products..."
                  [(ngModel)]="searchQuery"
                  (keydown.enter)="onSearch()"
                />
              </div>
            </div>

            <!-- Right Actions -->
            <div class="flex items-center space-x-4">
              <!-- Mobile menu button -->
              <button 
                z-button 
                zType="ghost" 
                zSize="icon" 
                class="md:hidden"
                (click)="toggleMobileMenu()"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>

              <!-- Wishlist -->
              <button 
                z-button 
                zType="ghost" 
                zSize="icon"
                routerLink="/shop/wishlist"
                class="hidden md:flex relative"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                @if (wishlistService.totalItems() > 0) {
                  <z-badge class="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center text-xs">
                    {{ wishlistService.totalItems() }}
                  </z-badge>
                }
              </button>

              <!-- Cart -->
              <button 
                z-button 
                zType="ghost" 
                zSize="icon"
                routerLink="/shop/cart"
                class="relative"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v4m4-4v4"/>
                </svg>
                @if (cartService.totalItems() > 0) {
                  <z-badge class="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center text-xs">
                    {{ cartService.totalItems() }}
                  </z-badge>
                }
              </button>

              <!-- User menu -->
              <z-dropdown-menu>
                <button z-dropdown-trigger z-button zType="ghost" zSize="icon">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </button>
                <z-dropdown-menu-content align="end">
                  <z-dropdown-menu-item routerLink="/auth/login">Sign In</z-dropdown-menu-item>
                  <z-dropdown-menu-item routerLink="/auth/register">Sign Up</z-dropdown-menu-item>
                  <z-dropdown-menu-divider />
                  <z-dropdown-menu-item>Orders</z-dropdown-menu-item>
                  <z-dropdown-menu-item>Account</z-dropdown-menu-item>
                </z-dropdown-menu-content>
              </z-dropdown-menu>
            </div>
          </div>

          <!-- Mobile menu -->
          @if (mobileMenuOpen()) {
            <div class="md:hidden border-t py-4">
              <!-- Mobile search -->
              <div class="mb-4">
                <div class="relative">
                  <svg class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input 
                    z-input 
                    class="pl-9 pr-4 w-full" 
                    type="search" 
                    placeholder="Search products..."
                    [(ngModel)]="searchQuery"
                    (keydown.enter)="onSearch()"
                  />
                </div>
              </div>

              <!-- Mobile navigation -->
              <nav class="space-y-2">
                <a routerLink="/shop/products" class="block py-2 text-sm font-medium" (click)="closeMobileMenu()">
                  Products
                </a>
                <a href="#" class="block py-2 text-sm font-medium" (click)="closeMobileMenu()">
                  Categories
                </a>
                <a href="#" class="block py-2 text-sm font-medium" (click)="closeMobileMenu()">
                  Deals
                </a>
                <a href="#" class="block py-2 text-sm font-medium" (click)="closeMobileMenu()">
                  About
                </a>
              </nav>
            </div>
          }
        </div>
      </header>

      <!-- Main Content -->
      <main>
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="bg-muted/30 border-t mt-auto">
        <div class="container mx-auto px-6 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Company info -->
            <div class="space-y-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span class="font-bold text-lg">Zard Shop</span>
              </div>
              <p class="text-sm text-muted-foreground">
                Your trusted online store for quality products at great prices.
              </p>
            </div>

            <!-- Quick links -->
            <div>
              <h3 class="font-semibold mb-4">Quick Links</h3>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" class="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#" class="text-muted-foreground hover:text-foreground">FAQ</a></li>
                <li><a href="#" class="text-muted-foreground hover:text-foreground">Support</a></li>
              </ul>
            </div>

            <!-- Categories -->
            <div>
              <h3 class="font-semibold mb-4">Categories</h3>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/shop/products?category=Electronics" class="text-muted-foreground hover:text-foreground">Electronics</a></li>
                <li><a routerLink="/shop/products?category=Clothing" class="text-muted-foreground hover:text-foreground">Clothing</a></li>
                <li><a routerLink="/shop/products?category=Home & Garden" class="text-muted-foreground hover:text-foreground">Home & Garden</a></li>
                <li><a routerLink="/shop/products?category=Kitchen" class="text-muted-foreground hover:text-foreground">Kitchen</a></li>
              </ul>
            </div>

            <!-- Customer service -->
            <div>
              <h3 class="font-semibold mb-4">Customer Service</h3>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="text-muted-foreground hover:text-foreground">Shipping Info</a></li>
                <li><a href="#" class="text-muted-foreground hover:text-foreground">Returns</a></li>
                <li><a href="#" class="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" class="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div class="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Zard Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <!-- Toast Notifications -->
      <z-toaster 
        position="bottom-right"
        [visibleToasts]="3"
        [duration]="4000"
        [closeButton]="true"
      />
    </div>
  `
})
export class EcommerceLayoutComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  
  searchQuery = '';
  mobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // Navigate to products with search query
      window.location.href = `/products?search=${encodeURIComponent(this.searchQuery)}`;
    }
  }
}