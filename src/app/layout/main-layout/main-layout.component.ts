import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { ZardCommandModule } from '@shared/components/command/command.module';
import { ZardTooltipDirective } from '@shared/components/tooltip/tooltip';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ZardButtonComponent,
    ZardInputDirective,
    ZardAvatarComponent,
    ZardBadgeComponent,
    ZardDropdownModule,
    ZardCommandModule,
    ZardTooltipDirective,
    ZardDividerComponent
  ],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Mobile menu overlay -->
      @if (sidebarOpen()) {
        <div 
          class="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Sidebar -->
      <aside 
        class="fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transform transition-transform lg:translate-x-0 lg:static lg:inset-0"
        [class.translate-x-0]="sidebarOpen()"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-6 border-b">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span class="font-bold text-lg">Zard</span>
          </div>
          <button 
            z-button 
            zType="ghost" 
            zSize="icon" 
            class="lg:hidden"
            (click)="toggleSidebar()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          @for (item of navigationItems(); track item.route) {
            <div>
              <a
                [routerLink]="item.route"
                routerLinkActive="bg-accent text-accent-foreground"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground group"
                (click)="closeSidebarOnMobile()"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @switch (item.icon) {
                    @case ('dashboard') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    }
                    @case ('analytics') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"/>
                    }
                    @case ('products') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M8 11v6a3 3 0 006 0v-6M8 11H5.5A2.5 2.5 0 003 8.5v-1A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0021 7.5v1a2.5 2.5 0 01-2.5 2.5H16"/>
                    }
                    @case ('projects') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 011-1h1m-1 1v1h1m-1-1l1 1"/>
                    }
                    @case ('invoices') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    }
                    @case ('profile') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    }
                    @case ('settings') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    }
                    @case ('cart') {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v4m4-4v4"/>
                    }
                  }
                </svg>
                {{ item.label }}
                @if (item.badge) {
                  <z-badge class="ml-auto text-xs">{{ item.badge }}</z-badge>
                }
              </a>
            </div>
          }
        </nav>

        <!-- User section -->
        <div class="border-t p-4">
          <div class="flex items-center space-x-3">
            <z-avatar 
              [zImage]="{ url: '/assets/avatar.jpg', alt: 'User', fallback: 'JD' }" 
              zSize="sm" 
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">John Doe</p>
              <p class="text-xs text-muted-foreground truncate">john@example.com</p>
            </div>
            <z-dropdown-menu>
              <button z-dropdown-trigger z-button zType="ghost" zSize="icon">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </button>
              <z-dropdown-menu-content>
                <z-dropdown-menu-item routerLink="/profile">Profile</z-dropdown-menu-item>
                <z-dropdown-menu-item routerLink="/settings">Settings</z-dropdown-menu-item>
                <z-divider />
                <z-dropdown-menu-item (click)="logout()">Sign out</z-dropdown-menu-item>
              </z-dropdown-menu-content>
            </z-dropdown-menu>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex flex-col lg:pl-64">
        <!-- Top header -->
        <header class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <!-- Mobile menu button -->
          <button 
            z-button 
            zType="ghost" 
            zSize="icon" 
            class="lg:hidden"
            (click)="toggleSidebar()"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- Search -->
          <div class="relative flex-1 max-w-md">
            <svg class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              z-input 
              class="pl-9 pr-4" 
              type="search" 
              placeholder="Search... (⌘K)"
              [(ngModel)]="searchQuery"
              (keydown)="onSearchKeydown($event)"
              (focus)="showCommandPalette()"
            />
          </div>

          <!-- Header actions -->
          <div class="flex items-center space-x-4">
            <!-- Theme toggle -->
            <button 
              z-button 
              zType="ghost" 
              zSize="icon"
              zTooltip="Toggle theme"
              (click)="toggleTheme()"
            >
              @if (isDarkMode()) {
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              } @else {
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              }
            </button>

            <!-- Notifications -->
            <z-dropdown-menu>
              <button 
                z-dropdown-trigger 
                z-button 
                zType="ghost" 
                zSize="icon"
                zTooltip="Notifications"
              >
                <div class="relative">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5v5zM19 3v4M12 21c0 0-8-4-8-11 0-3.314 2.686-6 6-6s6 2.686 6 6c0 7-8 11-8 11z"/>
                  </svg>
                  @if (unreadNotifications() > 0) {
                    <span class="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs text-white flex items-center justify-center">
                      {{ unreadNotifications() > 9 ? '9+' : unreadNotifications() }}
                    </span>
                  }
                </div>
              </button>
              <z-dropdown-menu-content align="end" class="w-80">
                <z-dropdown-menu-label>Notifications</z-dropdown-menu-label>
                <z-divider />
                @if (notifications().length === 0) {
                  <div class="p-4 text-center text-muted-foreground">
                    <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <p class="text-sm">No new notifications</p>
                  </div>
                } @else {
                  @for (notification of notifications(); track notification.id) {
                    <z-dropdown-menu-item class="flex items-start space-x-3 p-3">
                      <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" 
                           [class.opacity-0]="notification.read"></div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium">{{ notification.title }}</p>
                        <p class="text-xs text-muted-foreground">{{ notification.message }}</p>
                        <p class="text-xs text-muted-foreground mt-1">{{ notification.time }}</p>
                      </div>
                    </z-dropdown-menu-item>
                  }
                  <z-divider />
                  <z-dropdown-menu-item class="text-center">
                    <span class="text-sm">View all notifications</span>
                  </z-dropdown-menu-item>
                }
              </z-dropdown-menu-content>
            </z-dropdown-menu>

            <!-- User menu -->
            <z-dropdown-menu>
              <button z-dropdown-trigger class="flex items-center space-x-2">
                <z-avatar 
                  [zImage]="{ url: '/assets/avatar.jpg', alt: 'User', fallback: 'JD' }" 
                  zSize="sm" 
                />
              </button>
              <z-dropdown-menu-content align="end" class="w-56">
                <z-dropdown-menu-label>john@example.com</z-dropdown-menu-label>
                <z-divider />
                <z-dropdown-menu-item routerLink="/profile">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Profile
                </z-dropdown-menu-item>
                <z-dropdown-menu-item routerLink="/settings">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Settings
                </z-dropdown-menu-item>
                <z-divider />
                <z-dropdown-menu-item (click)="logout()">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Sign out
                </z-dropdown-menu-item>
              </z-dropdown-menu-content>
            </z-dropdown-menu>
          </div>
        </header>

        <!-- Page content -->
        <main class="flex-1">
          <router-outlet />
        </main>
      </div>

      <!-- Command Palette -->
      @if (commandPaletteOpen()) {
        <div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh]">
          <z-command class="mx-4 max-w-lg w-full bg-background border shadow-lg rounded-lg">
            <z-command-input 
              placeholder="Type a command or search..."
              [(ngModel)]="commandQuery"
              (blur)="hideCommandPalette()"
            />
            <z-command-list>
              <z-command-empty>No results found.</z-command-empty>
              
              <z-command-option-group zLabel="Quick Actions">
                <z-command-option zValue="new-order" zLabel="Create New Order" (click)="executeCommand('new-order')">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Create New Order
                </z-command-option>
                <z-command-option zValue="search-products" zLabel="Search Products" (click)="executeCommand('search-products')">
                  <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Search Products
                </z-command-option>
              </z-command-option-group>
              
              <z-command-divider />
              
              <z-command-option-group zLabel="Navigation">
                @for (item of navigationItems(); track item.route) {
                  <z-command-option [zValue]="item.route" [zLabel]="item.label" (click)="navigateToRoute(item.route)">
                    {{ item.label }}
                  </z-command-option>
                }
              </z-command-option-group>
            </z-command-list>
          </z-command>
        </div>
      }
    </div>
  `
})
export class MainLayoutComponent {
  private router = inject(Router);

  // State
  sidebarOpen = signal(false);
  searchQuery = signal('');
  commandQuery = signal('');
  commandPaletteOpen = signal(false);
  isDarkMode = signal(false);

  // Navigation items
  navigationItems = signal<NavigationItem[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Analytics', icon: 'analytics', route: '/analytics' },
    { label: 'Products', icon: 'products', route: '/products' },
    { label: 'Shopping Cart', icon: 'cart', route: '/cart', badge: '3' },
    { label: 'Projects', icon: 'projects', route: '/projects' },
    { label: 'Invoices', icon: 'invoices', route: '/invoices' },
    { label: 'Profile', icon: 'profile', route: '/profile' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ]);

  // Notifications
  notifications = signal([
    {
      id: '1',
      title: 'New Order Received',
      message: 'Order #1234 has been placed by John Smith',
      time: '5 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'Payment Completed',
      message: 'Invoice #INV-001 has been paid',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      title: 'Low Stock Alert',
      message: 'Product "Wireless Headphones" is running low',
      time: '2 hours ago',
      read: true
    }
  ]);

  unreadNotifications = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  constructor() {
    // Listen for route changes to close mobile sidebar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeSidebarOnMobile();
    });

    // Listen for keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.showCommandPalette();
      }
      if (e.key === 'Escape') {
        this.hideCommandPalette();
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }

  toggleTheme(): void {
    this.isDarkMode.update(dark => !dark);
    // Implement actual theme switching logic
    document.documentElement.classList.toggle('dark', this.isDarkMode());
  }

  showCommandPalette(): void {
    this.commandPaletteOpen.set(true);
  }

  hideCommandPalette(): void {
    this.commandPaletteOpen.set(false);
    this.commandQuery.set('');
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.showCommandPalette();
    }
  }

  executeCommand(command: string): void {
    this.hideCommandPalette();
    
    switch (command) {
      case 'new-order':
        console.log('Creating new order...');
        break;
      case 'search-products':
        this.router.navigate(['/products']);
        break;
      default:
        console.log('Unknown command:', command);
    }
  }

  navigateToRoute(route: string): void {
    this.hideCommandPalette();
    this.router.navigate([route]);
  }

  logout(): void {
    // Implement logout logic
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }
}