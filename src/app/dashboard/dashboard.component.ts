import { Component, TemplateRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';
import { ZardProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { ZardSkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { ZardDatePickerComponent } from '@shared/components/date-picker/date-picker.component';
import { ZardCheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { ZardBreadcrumbModule } from '@shared/components/breadcrumb/breadcrumb.module';
import { ZardTableModule } from '@shared/components/table/table.module';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { ZardPaginationModule } from '@shared/components/pagination/pagination.module';
import { ZardTabGroupComponent, ZardTabComponent } from '@shared/components/tabs/tabs.component';
import { ZardToastComponent } from '@shared/components/toast/toast.component';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';

interface DashboardStats {
  id: number;
  title: string;
  value: string;
  change: number;
  icon: string;
}

interface RecentTransaction {
  id: string;
  name: string;
  email: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
  avatar?: { url: string; alt: string; fallback: string };
}

interface Order {
  id: string;
  customer: { name: string; email: string; avatar?: any };
  product: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  amount: number;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardBadgeComponent,
    ZardAvatarComponent,
    ZardProgressBarComponent,
    ZardSkeletonComponent,
    ZardInputDirective,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardDatePickerComponent,
    ZardCheckboxComponent,
    ZardBreadcrumbModule,
    ZardTableModule,
    ZardDropdownModule,
    ZardPaginationModule,
    ZardTabGroupComponent,
    ZardTabComponent,
    ZardToastComponent,
    ZardDividerComponent
  ],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Header -->
      <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex h-16 items-center px-6">
          <z-breadcrumb>
            <z-breadcrumb-list>
              <z-breadcrumb-item>
                <z-breadcrumb-link routerLink="/dashboard">Dashboard</z-breadcrumb-link>
              </z-breadcrumb-item>
              <z-breadcrumb-separator />
              <z-breadcrumb-item>
                <z-breadcrumb-page>Analytics Overview</z-breadcrumb-page>
              </z-breadcrumb-item>
            </z-breadcrumb-list>
          </z-breadcrumb>

          <div class="ml-auto flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <svg class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                z-input
                class="pl-9 w-64"
                type="search"
                placeholder="Search..."
                [(ngModel)]="searchQuery"
              />
            </div>

            <!-- Notifications -->
            <button z-button zType="ghost" zSize="icon">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5v5zM19 3v4M12 21c0 0-8-4-8-11 0-3.314 2.686-6 6-6s6 2.686 6 6c0 7-8 11-8 11z"/>
              </svg>
            </button>

            <!-- User Menu -->
            <z-dropdown-menu>
              <button z-dropdown-trigger class="flex items-center space-x-2">
                <z-avatar [zImage]="{ url: '/assets/avatar.jpg', alt: 'John Doe', fallback: 'JD' }" zSize="sm" />
                <span class="font-medium">John Doe</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <z-dropdown-menu-content align="end" class="w-56">
                <z-dropdown-menu-label>john.doe@company.com</z-dropdown-menu-label>
                <z-divider />
                <z-dropdown-menu-item routerLink="/profile">Profile</z-dropdown-menu-item>
                <z-dropdown-menu-item routerLink="/settings">Settings</z-dropdown-menu-item>
                <z-dropdown-menu-item routerLink="/billing">Billing</z-dropdown-menu-item>
                <z-divider />
                <z-dropdown-menu-item (click)="logout()" class="text-destructive">Log out</z-dropdown-menu-item>
              </z-dropdown-menu-content>
            </z-dropdown-menu>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-6 py-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight">Good morning, John!</h1>
          <p class="text-muted-foreground mt-1">Here's what's happening with your business today.</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          @for (stat of stats(); track stat.id) {
            <z-card>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">{{ stat.title }}</p>
                  <p class="text-2xl font-bold">{{ stat.value }}</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    <span [class.text-green-600]="stat.change > 0" [class.text-red-600]="stat.change < 0">
                      {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
                    </span>
                    from last month
                  </p>
                </div>
                <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @switch (stat.icon) {
                      @case ('revenue') {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      }
                      @case ('users') {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                      }
                      @case ('orders') {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M8 11v4a4 4 0 008 0v-4M8 11H5.5A2.5 2.5 0 003 8.5v-1A2.5 2.5 0 005.5 5h13A2.5 2.5 0 0021 7.5v1a2.5 2.5 0 01-2.5 2.5H16"/>
                      }
                      @case ('growth') {
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      }
                    }
                  </svg>
                </div>
              </div>
            </z-card>
          }
        </div>

        <!-- Charts and Activity -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
          <!-- Revenue Chart -->
          <z-card zTitle="Revenue Overview" class="col-span-4">
            <z-tab-group class="mt-6">
              <z-tab label="Last 7 days">
                <div class="h-80 flex items-center justify-center bg-muted/20 rounded-lg mt-6">
                  <p class="text-muted-foreground">Revenue Chart (7 days)</p>
                </div>
              </z-tab>
              <z-tab label="Last 30 days">
                <div class="h-80 flex items-center justify-center bg-muted/20 rounded-lg mt-6">
                  <p class="text-muted-foreground">Revenue Chart (30 days)</p>
                </div>
              </z-tab>
              <z-tab label="Last 90 days">
                <div class="h-80 flex items-center justify-center bg-muted/20 rounded-lg mt-6">
                  <p class="text-muted-foreground">Revenue Chart (90 days)</p>
                </div>
              </z-tab>
            </z-tab-group>
          </z-card>

          <!-- Recent Activity -->
          <z-card zTitle="Recent Activity" class="col-span-3">
            <div class="space-y-4 mt-6">
              @if (transactionsLoading()) {
                @for (i of [1,2,3,4,5]; track i) {
                  <div class="flex items-center space-x-4">
                    <z-skeleton class="h-10 w-10 rounded-full" />
                    <div class="space-y-2 flex-1">
                      <z-skeleton class="h-4 w-[200px]" />
                      <z-skeleton class="h-3 w-[150px]" />
                    </div>
                    <z-skeleton class="h-6 w-12" />
                  </div>
                }
              } @else {
                @for (transaction of recentTransactions(); track transaction.id) {
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <z-avatar
                        [zImage]="transaction.avatar || { url: '', alt: transaction.name, fallback: getInitials(transaction.name) }"
                        zSize="sm"
                      />
                      <div>
                        <p class="text-sm font-medium">{{ transaction.name }}</p>
                        <p class="text-xs text-muted-foreground">{{ transaction.date | date:'short' }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-medium text-sm"
                         [class.text-green-600]="transaction.amount > 0"
                         [class.text-red-600]="transaction.amount < 0">
                        {{ (transaction.amount > 0 ? '+' : '') + '$' + getAbsoluteValue(transaction.amount) }}
                      </p>
                      <z-badge [zType]="getStatusBadgeType(transaction.status)" class="text-xs">
                        {{ transaction.status }}
                      </z-badge>
                    </div>
                  </div>
                }
              }
            </div>
          </z-card>
        </div>

        <!-- Recent Orders Table -->
        <z-card zTitle="Recent Orders" class="mb-8">
          <div class="space-y-4 mt-6">
            <!-- Filters -->
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex-1 min-w-64">
                <input
                  z-input
                  type="search"
                  placeholder="Search orders..."
                  [(ngModel)]="orderSearchQuery"
                />
              </div>
              <z-select placeholder="Status" [(ngModel)]="filterStatus" class="min-w-32">
                <z-select-item value="all" label="All Status" />
                <z-select-item value="pending" label="Pending" />
                <z-select-item value="processing" label="Processing" />
                <z-select-item value="completed" label="Completed" />
                <z-select-item value="cancelled" label="Cancelled" />
              </z-select>
              <z-date-picker
                placeholder="Select date"
                [(ngModel)]="filterDate"
              />
              <button z-button zType="outline">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
                Export
              </button>
            </div>

            <!-- Orders Table -->
            <div class="rounded-md border">
              <table z-table>
                <thead z-table-header>
                  <tr z-table-row>
                    <th z-table-head>
                      <z-checkbox />
                    </th>
                    <th z-table-head>Order ID</th>
                    <th z-table-head>Customer</th>
                    <th z-table-head>Product</th>
                    <th z-table-head>Status</th>
                    <th z-table-head class="text-right">Amount</th>
                    <th z-table-head>Actions</th>
                  </tr>
                </thead>
                <tbody z-table-body>
                  @for (order of filteredOrders(); track order.id) {
                    <tr z-table-row>
                      <td z-table-cell>
                        <z-checkbox />
                      </td>
                      <td z-table-cell class="font-medium">#{{ order.id }}</td>
                      <td z-table-cell>
                        <div class="flex items-center space-x-2">
                          <z-avatar
                            [zImage]="order.customer.avatar || { url: '', alt: order.customer.name, fallback: getInitials(order.customer.name) }"
                            zSize="sm"
                          />
                          <div>
                            <p class="font-medium">{{ order.customer.name }}</p>
                            <p class="text-xs text-muted-foreground">{{ order.customer.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td z-table-cell>{{ order.product }}</td>
                      <td z-table-cell>
                        <z-badge [zType]="getOrderStatusType(order.status)">
                          {{ order.status | titlecase }}
                        </z-badge>
                      </td>
                      <td z-table-cell class="text-right font-medium">{{ '$' + order.amount }}</td>
                      <td z-table-cell>
                        <z-dropdown-menu>
                          <button z-dropdown-trigger z-button zType="ghost" zSize="icon">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                            </svg>
                          </button>
                          <z-dropdown-menu-content>
                            <z-dropdown-menu-item>View Details</z-dropdown-menu-item>
                            <z-dropdown-menu-item>Edit Order</z-dropdown-menu-item>
                            <z-dropdown-menu-item>Send Invoice</z-dropdown-menu-item>
                            <z-divider />
                            <z-dropdown-menu-item class="text-destructive">Cancel Order</z-dropdown-menu-item>
                          </z-dropdown-menu-content>
                        </z-dropdown-menu>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between">
              <p class="text-sm text-muted-foreground">
                Showing {{ startIndex() + 1 }} to {{ endIndex() }} of {{ totalOrders() }} orders
              </p>
              <z-pagination
                [zPageIndex]="currentPage()"
                [zTotal]="totalPages()"
                (zPageIndexChange)="onPageChange($event)"
              />
            </div>
          </div>
        </z-card>

        <!-- System Status -->
        <div class="grid gap-6 md:grid-cols-3">
          <z-card zTitle="System Health">
            <div class="space-y-4 mt-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 rounded-full bg-green-500"></div>
                  <span class="text-sm">API Status</span>
                </div>
                <span class="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 rounded-full bg-green-500"></div>
                  <span class="text-sm">Database</span>
                </div>
                <span class="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span class="text-sm">Cache</span>
                </div>
                <span class="text-sm text-yellow-600 font-medium">Degraded</span>
              </div>
            </div>
          </z-card>

          <z-card zTitle="Server Load">
            <div class="space-y-4 mt-6">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>CPU Usage</span>
                  <span>65%</span>
                </div>
                <z-progress-bar [progress]="65" />
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Memory</span>
                  <span>78%</span>
                </div>
                <z-progress-bar [progress]="78" />
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span>Storage</span>
                  <span>45%</span>
                </div>
                <z-progress-bar [progress]="45" />
              </div>
            </div>
          </z-card>

          <z-card zTitle="Quick Actions">
            <div class="space-y-3 mt-6">
              <button z-button zFull="true" zType="outline">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Create New Order
              </button>
              <button z-button zFull="true" zType="outline">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
                Add Customer
              </button>
              <button z-button zFull="true" zType="outline">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"/>
                </svg>
                Generate Report
              </button>
            </div>
          </z-card>
        </div>
      </main>

      <!-- Toast Container -->
      <z-toaster position="bottom-right" />
    </div>
  `
})
export class DashboardComponent {
  Math = Math;

  // Signals for reactive state
  searchQuery = signal('');
  orderSearchQuery = signal('');
  filterStatus = signal('all');
  filterDate = signal<Date | null>(null);
  currentPage = signal(1);
  itemsPerPage = signal(10);
  transactionsLoading = signal(false);

  // Dashboard statistics
  stats = signal<DashboardStats[]>([
    { id: 1, title: 'Total Revenue', value: '$45,231.89', change: 20.1, icon: 'revenue' },
    { id: 2, title: 'Active Users', value: '2,350', change: 15.3, icon: 'users' },
    { id: 3, title: 'Total Orders', value: '12,234', change: -2.5, icon: 'orders' },
    { id: 4, title: 'Growth Rate', value: '573', change: 12.5, icon: 'growth' }
  ]);

  // Recent transactions data
  recentTransactions = signal<RecentTransaction[]>([
    {
      id: '1',
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
      amount: 1999,
      status: 'completed',
      date: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Jackson Lee',
      email: 'jackson.lee@email.com',
      amount: -39,
      status: 'pending',
      date: new Date('2024-01-14')
    },
    {
      id: '3',
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
      amount: 299,
      status: 'completed',
      date: new Date('2024-01-13')
    },
    {
      id: '4',
      name: 'William Kim',
      email: 'will@email.com',
      amount: 99,
      status: 'completed',
      date: new Date('2024-01-12')
    },
    {
      id: '5',
      name: 'Sofia Davis',
      email: 'sofia.davis@email.com',
      amount: -299,
      status: 'failed',
      date: new Date('2024-01-11')
    }
  ]);

  // Orders data
  orders = signal<Order[]>([
    {
      id: '1001',
      customer: { name: 'John Smith', email: 'john@example.com' },
      product: 'Premium Subscription',
      status: 'completed',
      amount: 299,
      date: new Date('2024-01-15')
    },
    {
      id: '1002',
      customer: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      product: 'Basic Plan',
      status: 'processing',
      amount: 99,
      date: new Date('2024-01-14')
    },
    {
      id: '1003',
      customer: { name: 'Mike Wilson', email: 'mike@example.com' },
      product: 'Enterprise License',
      status: 'pending',
      amount: 999,
      date: new Date('2024-01-13')
    },
    {
      id: '1004',
      customer: { name: 'Emily Davis', email: 'emily@example.com' },
      product: 'Pro Plan',
      status: 'cancelled',
      amount: 199,
      date: new Date('2024-01-12')
    },
    {
      id: '1005',
      customer: { name: 'Alex Brown', email: 'alex@example.com' },
      product: 'Starter Package',
      status: 'completed',
      amount: 49,
      date: new Date('2024-01-11')
    }
  ]);

  // Computed values
  filteredOrders = signal(this.orders());
  totalOrders = signal(this.orders().length);
  totalPages = signal(Math.ceil(this.totalOrders() / this.itemsPerPage()));
  startIndex = signal((this.currentPage() - 1) * this.itemsPerPage());
  endIndex = signal(Math.min(this.startIndex() + this.itemsPerPage(), this.totalOrders()));

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getStatusBadgeType(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  }

  getOrderStatusType(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'completed': return 'default';
      case 'processing': return 'secondary';
      case 'pending': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  logout(): void {
    // Implement logout logic
    console.log('Logging out...');
  }
}
