# Zard Angular Components - Complete Implementation Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Form Components](#form-components)
3. [Display Components](#display-components)
4. [Layout Components](#layout-components)
5. [Feedback Components](#feedback-components)
6. [Navigation Components](#navigation-components)
7. [Overlay Components](#overlay-components)
8. [Real-World Examples](#real-world-examples)

---

## Getting Started

All Zard components are standalone Angular components that can be imported directly into your components or modules.

```typescript
import { Component } from "@angular/core";
import { ZardButtonComponent } from "@shared/components/button/button.component";
import { ZardCardComponent } from "@shared/components/card/card.component";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [ZardButtonComponent, ZardCardComponent],
  template: `
    <z-card>
      <button z-button>Click me</button>
    </z-card>
  `,
})
export class ExampleComponent {}
```

---

## Form Components

### 1. Input

Input fields with various states and sizes.

```typescript
import { ZardInputDirective } from '@shared/components/input/input.directive';

// Basic input
<input z-input type="text" placeholder="Enter your name" />

// Password input with size variant
<input z-input zSize="lg" type="password" placeholder="Password" />

// Error state input
<input z-input zStatus="error" type="email" placeholder="Email" />

// Borderless input
<input z-input zBorderless="true" type="text" placeholder="Borderless" />

// Textarea
<textarea z-input rows="4" placeholder="Enter description"></textarea>

// With form control
<input z-input [(ngModel)]="userName" type="text" placeholder="Username" />

// Search input with icon
<div class="relative">
  <svg class="absolute left-3 top-3 h-4 w-4 text-muted-foreground">
    <!-- search icon -->
  </svg>
  <input z-input class="pl-9" type="search" placeholder="Search..." />
</div>
```

### 2. Checkbox

Checkboxes with custom styling and form integration.

```typescript
import { ZardCheckboxComponent } from '@shared/components/checkbox/checkbox.component';

// Basic checkbox
<z-checkbox [(ngModel)]="isChecked">Accept terms and conditions</z-checkbox>

// Disabled checkbox
<z-checkbox [disabled]="true">This option is disabled</z-checkbox>

// Different sizes
<z-checkbox zSize="sm">Small checkbox</z-checkbox>
<z-checkbox zSize="default">Default checkbox</z-checkbox>
<z-checkbox zSize="lg">Large checkbox</z-checkbox>

// In a form with validation
<form [formGroup]="form">
  <z-checkbox formControlName="newsletter">
    Subscribe to newsletter
  </z-checkbox>
  <z-checkbox formControlName="terms" [disabled]="!form.get('newsletter')?.value">
    I agree to the terms
  </z-checkbox>
</form>

// Task list example
@Component({
  template: `
    <div class="space-y-2">
      @for (task of tasks; track task.id) {
        <div class="flex items-center space-x-2">
          <z-checkbox
            [(ngModel)]="task.completed"
            (checkChange)="onTaskChange(task)"
          />
          <span [class.line-through]="task.completed">{{ task.name }}</span>
        </div>
      }
    </div>
  `
})
export class TaskListComponent {
  tasks = [
    { id: 1, name: 'Complete documentation', completed: false },
    { id: 2, name: 'Review pull request', completed: true },
    { id: 3, name: 'Deploy to production', completed: false }
  ];
}
```

### 3. Radio

Radio buttons for single selection.

```typescript
import { ZardRadioComponent } from '@shared/components/radio/radio.component';

// Basic radio group
<div class="space-y-2">
  <z-radio name="plan" value="free" [(ngModel)]="selectedPlan">
    Free Plan
  </z-radio>
  <z-radio name="plan" value="pro" [(ngModel)]="selectedPlan">
    Pro Plan ($9/month)
  </z-radio>
  <z-radio name="plan" value="enterprise" [(ngModel)]="selectedPlan">
    Enterprise (Contact us)
  </z-radio>
</div>

// Different sizes
<z-radio zSize="sm" name="size" value="s">Small</z-radio>
<z-radio zSize="default" name="size" value="m">Medium</z-radio>
<z-radio zSize="lg" name="size" value="l">Large</z-radio>

// Payment method selector
@Component({
  template: `
    <div class="space-y-4">
      <h3 class="font-medium">Payment Method</h3>
      @for (method of paymentMethods; track method.id) {
        <div class="flex items-start space-x-3 p-4 border rounded-lg"
             [class.border-primary]="selectedMethod === method.id">
          <z-radio
            name="payment"
            [value]="method.id"
            [(ngModel)]="selectedMethod"
          />
          <div class="flex-1">
            <div class="font-medium">{{ method.name }}</div>
            <div class="text-sm text-muted-foreground">{{ method.description }}</div>
          </div>
        </div>
      }
    </div>
  `
})
export class PaymentMethodComponent {
  selectedMethod = 'card';
  paymentMethods = [
    { id: 'card', name: 'Credit Card', description: 'Pay with Visa, Mastercard, or Amex' },
    { id: 'paypal', name: 'PayPal', description: 'Secure payment with PayPal' },
    { id: 'bank', name: 'Bank Transfer', description: 'Direct bank transfer' }
  ];
}
```

### 4. Switch

Toggle switches for on/off states.

```typescript
import { ZardSwitchComponent } from '@shared/components/switch/switch.component';

// Basic switch
<z-switch [(ngModel)]="darkMode">Dark Mode</z-switch>

// Different sizes
<z-switch zSize="sm">Small switch</z-switch>
<z-switch zSize="default">Default switch</z-switch>
<z-switch zSize="lg">Large switch</z-switch>

// Settings panel example
@Component({
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium">Email Notifications</h3>
          <p class="text-sm text-muted-foreground">
            Receive email updates about your account
          </p>
        </div>
        <z-switch [(ngModel)]="settings.emailNotifications" />
      </div>

      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium">Two-Factor Authentication</h3>
          <p class="text-sm text-muted-foreground">
            Add an extra layer of security
          </p>
        </div>
        <z-switch
          [(ngModel)]="settings.twoFactor"
          (checkChange)="onTwoFactorChange($event)"
        />
      </div>

      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium">Public Profile</h3>
          <p class="text-sm text-muted-foreground">
            Make your profile visible to everyone
          </p>
        </div>
        <z-switch [(ngModel)]="settings.publicProfile" />
      </div>
    </div>
  `
})
export class SettingsPanelComponent {
  settings = {
    emailNotifications: true,
    twoFactor: false,
    publicProfile: true
  };
}
```

### 5. Select

Dropdown select with options.

```typescript
import { ZardSelectComponent, ZardSelectItemComponent } from '@shared/components/select/select.component';

// Basic select
<z-select placeholder="Select a country" [(ngModel)]="selectedCountry">
  <z-select-item value="us" label="United States" />
  <z-select-item value="uk" label="United Kingdom" />
  <z-select-item value="ca" label="Canada" />
  <z-select-item value="au" label="Australia" />
</z-select>

// Different sizes
<z-select size="sm" placeholder="Small">
  <z-select-item value="1" label="Option 1" />
</z-select>

// Time zone selector
@Component({
  template: `
    <div class="space-y-4">
      <label class="text-sm font-medium">Time Zone</label>
      <z-select
        placeholder="Select your timezone"
        [(ngModel)]="selectedTimezone"
        (selectionChange)="onTimezoneChange($event)"
      >
        @for (zone of timezones; track zone.value) {
          <z-select-item [value]="zone.value" [label]="zone.label" />
        }
      </z-select>
    </div>
  `
})
export class TimezoneSelectComponent {
  selectedTimezone = 'America/New_York';
  timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' }
  ];
}
```

### 6. Combobox

Searchable dropdown with command palette.

```typescript
import { ZardComboboxComponent } from '@shared/components/combobox/combobox.component';

// Basic combobox
<z-combobox
  placeholder="Select framework"
  searchPlaceholder="Search frameworks..."
  [options]="frameworks"
  [(ngModel)]="selectedFramework"
/>

// With grouped options
@Component({
  template: `
    <z-combobox
      placeholder="Select a technology"
      [groups]="techGroups"
      [searchable]="true"
      (zOnSelect)="onTechSelect($event)"
    />
  `
})
export class TechSelectorComponent {
  techGroups = [
    {
      label: 'Frontend',
      options: [
        { value: 'react', label: 'React', icon: 'icon-react' },
        { value: 'angular', label: 'Angular', icon: 'icon-angular' },
        { value: 'vue', label: 'Vue', icon: 'icon-vue' }
      ]
    },
    {
      label: 'Backend',
      options: [
        { value: 'node', label: 'Node.js', icon: 'icon-node' },
        { value: 'python', label: 'Python', icon: 'icon-python' },
        { value: 'java', label: 'Java', icon: 'icon-java' }
      ]
    }
  ];
}
```

### 7. Slider

Range slider for numeric input.

```typescript
import { ZardSliderComponent } from '@shared/components/slider/slider.component';

// Basic slider
<z-slider
  [zMin]="0"
  [zMax]="100"
  [zStep]="1"
  [(ngModel)]="volume"
/>

// Volume control
@Component({
  template: `
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <svg class="w-4 h-4"><!-- volume low icon --></svg>
        <z-slider
          class="flex-1"
          [zMin]="0"
          [zMax]="100"
          [zDefault]="50"
          (onSlide)="onVolumeChange($event)"
        />
        <svg class="w-4 h-4"><!-- volume high icon --></svg>
      </div>
      <div class="text-center text-sm text-muted-foreground">
        Volume: {{ volume }}%
      </div>
    </div>
  `
})
export class VolumeControlComponent {
  volume = 50;
  onVolumeChange(value: number) {
    this.volume = value;
  }
}

// Price range selector
<div class="space-y-4">
  <label class="text-sm font-medium">Price Range</label>
  <z-slider
    [zMin]="0"
    [zMax]="1000"
    [zStep]="50"
    [(ngModel)]="maxPrice"
  />
  <div class="flex justify-between text-sm text-muted-foreground">
    <span>$0</span>
    <span>{{ '$' + maxPrice }}</span>
  </div>
</div>
```

### 8. Date Picker

Date selection with calendar.

```typescript
import { ZardDatePickerComponent } from '@shared/components/date-picker/date-picker.component';

// Basic date picker
<z-date-picker
  placeholder="Select date"
  [(ngModel)]="selectedDate"
/>

// With min/max dates
<z-date-picker
  placeholder="Select appointment"
  [minDate]="today"
  [maxDate]="maxDate"
  [(ngModel)]="appointmentDate"
/>

// Custom format
<z-date-picker
  placeholder="Birth date"
  zFormat="dd/MM/yyyy"
  [(ngModel)]="birthDate"
/>

// Event booking form
@Component({
  template: `
    <form [formGroup]="bookingForm" class="space-y-4">
      <div>
        <label class="text-sm font-medium">Check-in Date</label>
        <z-date-picker
          formControlName="checkIn"
          placeholder="Select check-in date"
          [minDate]="today"
          (dateChange)="onCheckInChange($event)"
        />
      </div>

      <div>
        <label class="text-sm font-medium">Check-out Date</label>
        <z-date-picker
          formControlName="checkOut"
          placeholder="Select check-out date"
          [minDate]="bookingForm.get('checkIn')?.value || today"
        />
      </div>

      <div class="p-4 bg-muted rounded-lg">
        <p class="text-sm">
          Total nights: {{ calculateNights() }}
        </p>
      </div>
    </form>
  `
})
export class BookingFormComponent {
  today = new Date();
  bookingForm = this.fb.group({
    checkIn: [null],
    checkOut: [null]
  });
}
```

---

## Display Components

### 9. Alert

Status messages and notifications.

```typescript
import { ZardAlertComponent } from '@shared/components/alert/alert.component';

// Different types
<z-alert zType="info" zTitle="Information" zDescription="This is an informational message." />
<z-alert zType="success" zTitle="Success!" zDescription="Your changes have been saved." />
<z-alert zType="warning" zTitle="Warning" zDescription="Please review before proceeding." />
<z-alert zType="error" zTitle="Error" zDescription="Something went wrong. Please try again." />

// Custom icon
<z-alert
  zType="info"
  zIcon="icon-shield-check"
  zTitle="Security Update"
  zDescription="Your account security settings have been updated."
/>

// Form validation alerts
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      @if (form.errors?.['passwordMismatch']) {
        <z-alert
          zType="error"
          zTitle="Password Mismatch"
          zDescription="The passwords you entered do not match."
        />
      }

      @if (submitSuccess) {
        <z-alert
          zType="success"
          zTitle="Account Created"
          zDescription="Your account has been successfully created. Check your email for verification."
        />
      }

      <!-- form fields -->
    </form>
  `
})
export class SignupFormComponent {}
```

### 10. Badge

Labels and status indicators.

```typescript
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';

// Basic badges
<z-badge>Default</z-badge>
<z-badge zType="secondary">Secondary</z-badge>
<z-badge zType="outline">Outline</z-badge>
<z-badge zType="destructive">Destructive</z-badge>

// Status badges
<div class="flex gap-2">
  <z-badge class="bg-green-500">Active</z-badge>
  <z-badge class="bg-yellow-500">Pending</z-badge>
  <z-badge class="bg-red-500">Expired</z-badge>
  <z-badge class="bg-gray-500">Archived</z-badge>
</div>

// User profile with badges
@Component({
  template: `
    <div class="flex items-center space-x-4">
      <z-avatar [zImage]="user.avatar" />
      <div>
        <div class="flex items-center gap-2">
          <h3 class="font-medium">{{ user.name }}</h3>
          @if (user.isPro) {
            <z-badge class="bg-gradient-to-r from-purple-500 to-pink-500">
              PRO
            </z-badge>
          }
          @if (user.isVerified) {
            <z-badge zType="outline">
              <svg class="w-3 h-3 mr-1"><!-- check icon --></svg>
              Verified
            </z-badge>
          }
        </div>
        <p class="text-sm text-muted-foreground">{{ user.role }}</p>
      </div>
    </div>
  `
})
export class UserProfileComponent {}

// Table with status badges
<table z-table>
  <thead z-table-header>
    <tr z-table-row>
      <th z-table-head>Order ID</th>
      <th z-table-head>Customer</th>
      <th z-table-head>Status</th>
      <th z-table-head>Total</th>
    </tr>
  </thead>
  <tbody z-table-body>
    @for (order of orders; track order.id) {
      <tr z-table-row>
        <td z-table-cell>{{ order.id }}</td>
        <td z-table-cell>{{ order.customer }}</td>
        <td z-table-cell>
          <z-badge [class]="getStatusClass(order.status)">
            {{ order.status }}
          </z-badge>
        </td>
        <td z-table-cell>{{ '$' + order.total }}</td>
      </tr>
    }
  </tbody>
</table>
```

### 11. Avatar

User avatars with fallbacks.

```typescript
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';

// Basic avatar with image
<z-avatar [zImage]="{
  url: '/assets/user.jpg',
  alt: 'John Doe',
  fallback: 'JD'
}" />

// Different sizes
<z-avatar zSize="sm" [zImage]="avatarConfig" />
<z-avatar zSize="default" [zImage]="avatarConfig" />
<z-avatar zSize="lg" [zImage]="avatarConfig" />

// With status indicator
<z-avatar
  [zImage]="userAvatar"
  zStatus="online"
  zShape="circle"
/>

// Avatar group
@Component({
  template: `
    <div class="flex -space-x-2">
      @for (user of users; track user.id; let i = $index) {
        <z-avatar
          [zImage]="user.avatar"
          zSize="sm"
          zBorder="true"
          [style.z-index]="users.length - i"
        />
      }
      @if (extraCount > 0) {
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-muted border-2 border-background">
          <span class="text-xs">+{{ extraCount }}</span>
        </div>
      }
    </div>
  `
})
export class AvatarGroupComponent {
  users = [/* user data */];
  extraCount = 5;
}

// User list with avatars
<div class="space-y-4">
  @for (user of team; track user.id) {
    <div class="flex items-center space-x-4">
      <z-avatar
        [zImage]="user.avatar"
        [zStatus]="user.status"
      />
      <div class="flex-1">
        <p class="font-medium">{{ user.name }}</p>
        <p class="text-sm text-muted-foreground">{{ user.email }}</p>
      </div>
      <z-badge>{{ user.role }}</z-badge>
    </div>
  }
</div>
```

### 12. Progress Bar

Loading and progress indicators.

```typescript
import { ZardProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';

// Basic progress
<z-progress-bar [progress]="60" />

// Different sizes
<z-progress-bar zSize="sm" [progress]="40" />
<z-progress-bar zSize="default" [progress]="60" />
<z-progress-bar zSize="lg" [progress]="80" />

// Indeterminate loading
<z-progress-bar zIndeterminate="true" />

// File upload progress
@Component({
  template: `
    <div class="space-y-4">
      @for (file of uploadingFiles; track file.id) {
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>{{ file.name }}</span>
            <span>{{ file.progress }}%</span>
          </div>
          <z-progress-bar [progress]="file.progress" />
          @if (file.progress === 100) {
            <p class="text-sm text-green-600">Upload complete!</p>
          }
        </div>
      }
    </div>
  `
})
export class FileUploadComponent {
  uploadingFiles = [
    { id: 1, name: 'document.pdf', progress: 100 },
    { id: 2, name: 'image.jpg', progress: 65 },
    { id: 3, name: 'video.mp4', progress: 30 }
  ];
}

// Multi-step form progress
<div class="space-y-6">
  <div class="flex justify-between text-sm">
    <span>Step {{ currentStep }} of {{ totalSteps }}</span>
    <span>{{ progressPercentage }}% Complete</span>
  </div>
  <z-progress-bar [progress]="progressPercentage" />
  <div class="flex justify-between">
    @for (step of steps; track step.id) {
      <div class="text-center">
        <div class="w-8 h-8 rounded-full flex items-center justify-center"
             [class.bg-primary]="step.completed"
             [class.bg-muted]="!step.completed">
          {{ step.number }}
        </div>
        <p class="text-xs mt-1">{{ step.label }}</p>
      </div>
    }
  </div>
</div>
```

### 13. Skeleton

Loading placeholders.

```typescript
import { ZardSkeletonComponent } from '@shared/components/skeleton/skeleton.component';

// Text skeleton
<div class="space-y-2">
  <z-skeleton class="h-4 w-[250px]" />
  <z-skeleton class="h-4 w-[200px]" />
</div>

// Card skeleton
<div class="rounded-lg border p-6 space-y-4">
  <z-skeleton class="h-12 w-12 rounded-full" />
  <div class="space-y-2">
    <z-skeleton class="h-4 w-[250px]" />
    <z-skeleton class="h-4 w-[200px]" />
  </div>
</div>

// Table skeleton
@Component({
  template: `
    <table z-table>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Name</th>
          <th z-table-head>Email</th>
          <th z-table-head>Status</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (i of [1,2,3,4,5]; track i) {
          <tr z-table-row>
            <td z-table-cell>
              <z-skeleton class="h-4 w-[150px]" />
            </td>
            <td z-table-cell>
              <z-skeleton class="h-4 w-[200px]" />
            </td>
            <td z-table-cell>
              <z-skeleton class="h-4 w-[80px]" />
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class TableSkeletonComponent {}

// Content loader with skeleton
@Component({
  template: `
    @if (loading) {
      <div class="space-y-4">
        <!-- Profile skeleton -->
        <div class="flex items-center space-x-4">
          <z-skeleton class="h-12 w-12 rounded-full" />
          <div class="space-y-2">
            <z-skeleton class="h-4 w-[200px]" />
            <z-skeleton class="h-3 w-[150px]" />
          </div>
        </div>

        <!-- Content skeleton -->
        <div class="space-y-2">
          <z-skeleton class="h-4 w-full" />
          <z-skeleton class="h-4 w-full" />
          <z-skeleton class="h-4 w-3/4" />
        </div>
      </div>
    } @else {
      <!-- Actual content -->
      <div>{{ content }}</div>
    }
  `
})
export class ContentLoaderComponent {}
```

### 14. Loader

Spinning loader animation.

```typescript
import { ZardLoaderComponent } from '@shared/components/loader/loader.component';

// Basic loader
<z-loader />

// Different sizes
<z-loader zSize="sm" />
<z-loader zSize="default" />
<z-loader zSize="lg" />

// Loading button
<button z-button [disabled]="loading">
  @if (loading) {
    <z-loader zSize="sm" class="mr-2" />
  }
  {{ loading ? 'Processing...' : 'Submit' }}
</button>

// Full page loader
@Component({
  template: `
    @if (isLoading) {
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div class="flex h-full items-center justify-center">
          <div class="text-center space-y-4">
            <z-loader zSize="lg" />
            <p class="text-sm text-muted-foreground">{{ loadingMessage }}</p>
          </div>
        </div>
      </div>
    }

    <!-- Page content -->
  `
})
export class PageLoaderComponent {
  isLoading = true;
  loadingMessage = 'Loading your data...';
}
```

---

## Layout Components

### 15. Card

Content containers with optional headers.

```typescript
import { ZardCardComponent } from '@shared/components/card/card.component';

// Basic card
<z-card>
  <p>This is card content</p>
</z-card>

// Card with title and description
<z-card
  zTitle="Card Title"
  zDescription="This is the card description"
>
  <p>Card body content goes here</p>
</z-card>

// Pricing card example
@Component({
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      @for (plan of pricingPlans; track plan.id) {
        <z-card [class.border-primary]="plan.featured">
          <div class="space-y-4">
            @if (plan.featured) {
              <z-badge class="bg-primary">Most Popular</z-badge>
            }

            <div>
              <h3 class="text-2xl font-bold">{{ plan.name }}</h3>
              <p class="text-muted-foreground">{{ plan.description }}</p>
            </div>

            <div class="text-4xl font-bold">
              {{ '$' + plan.price }}<span class="text-lg font-normal">/month</span>
            </div>

            <ul class="space-y-2">
              @for (feature of plan.features; track feature) {
                <li class="flex items-center">
                  <svg class="w-4 h-4 mr-2 text-green-500"><!-- check icon --></svg>
                  {{ feature }}
                </li>
              }
            </ul>

            <button z-button [zType]="plan.featured ? 'default' : 'outline'" zFull="true">
              {{ plan.featured ? 'Get Started' : 'Learn More' }}
            </button>
          </div>
        </z-card>
      }
    </div>
  `
})
export class PricingCardsComponent {
  pricingPlans = [
    {
      id: 1,
      name: 'Basic',
      price: 9,
      description: 'Perfect for individuals',
      features: ['5 Projects', '10GB Storage', 'Basic Support'],
      featured: false
    },
    {
      id: 2,
      name: 'Pro',
      price: 29,
      description: 'Great for teams',
      features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics'],
      featured: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 99,
      description: 'For large organizations',
      features: ['Everything in Pro', 'Unlimited Storage', 'Dedicated Support', 'Custom Integrations'],
      featured: false
    }
  ];
}

// Stats card
<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
  <z-card>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-muted-foreground">Total Revenue</p>
        <p class="text-2xl font-bold">$45,231</p>
        <p class="text-xs text-green-600">+12% from last month</p>
      </div>
      <svg class="w-8 h-8 text-muted-foreground"><!-- dollar icon --></svg>
    </div>
  </z-card>
  <!-- More stat cards... -->
</div>
```

### 16. Accordion

Collapsible content sections.

```typescript
import { ZardAccordionComponent, ZardAccordionItemComponent } from '@shared/components/accordion/accordion.component';

// Basic accordion
<z-accordion>
  <z-accordion-item zValue="item-1" zTitle="What is Angular?">
    Angular is a platform for building mobile and desktop web applications.
  </z-accordion-item>
  <z-accordion-item zValue="item-2" zTitle="How do I get started?">
    You can start by installing the Angular CLI and creating a new project.
  </z-accordion-item>
  <z-accordion-item zValue="item-3" zTitle="What are components?">
    Components are the basic building blocks of Angular applications.
  </z-accordion-item>
</z-accordion>

// Multiple selection accordion
<z-accordion zType="multiple" [zDefaultValue]="['item-1', 'item-2']">
  <z-accordion-item zValue="item-1" zTitle="First Section">
    Content for first section
  </z-accordion-item>
  <z-accordion-item zValue="item-2" zTitle="Second Section">
    Content for second section
  </z-accordion-item>
</z-accordion>

// FAQ Section
@Component({
  template: `
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
      <z-accordion zCollapsible="true">
        @for (faq of faqs; track faq.id) {
          <z-accordion-item [zValue]="'faq-' + faq.id" [zTitle]="faq.question">
            <div class="prose">
              {{ faq.answer }}
              @if (faq.link) {
                <a [href]="faq.link" class="text-primary">Learn more →</a>
              }
            </div>
          </z-accordion-item>
        }
      </z-accordion>
    </div>
  `
})
export class FAQSectionComponent {
  faqs = [
    {
      id: 1,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers.',
      link: '/payments'
    },
    {
      id: 2,
      question: 'Can I cancel my subscription?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings.'
    },
    {
      id: 3,
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all plans.'
    }
  ];
}
```

### 17. Tabs

Tabbed content organization.

```typescript
import { ZardTabGroupComponent, ZardTabComponent } from '@shared/components/tabs/tabs.component';

// Basic tabs
<z-tab-group>
  <z-tab zTitle="Overview" zValue="overview">
    <p>Overview content here</p>
  </z-tab>
  <z-tab zTitle="Features" zValue="features">
    <p>Features content here</p>
  </z-tab>
  <z-tab zTitle="Pricing" zValue="pricing">
    <p>Pricing content here</p>
  </z-tab>
</z-tab-group>

// Scrollable tabs with arrows
<z-tab-group zShowArrow="true" zScrollAmount="200">
  @for (tab of manyTabs; track tab.id) {
    <z-tab [zTitle]="tab.title" [zValue]="tab.value">
      {{ tab.content }}
    </z-tab>
  }
</z-tab-group>

// User profile tabs
@Component({
  template: `
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <z-avatar [zImage]="user.avatar" zSize="lg" />
        <div>
          <h2 class="text-2xl font-bold">{{ user.name }}</h2>
          <p class="text-muted-foreground">{{ user.email }}</p>
        </div>
      </div>

      <z-tab-group (zOnTabChange)="onTabChange($event)">
        <z-tab zTitle="Profile" zValue="profile">
          <div class="space-y-4 mt-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium">First Name</label>
                <input z-input [(ngModel)]="user.firstName" />
              </div>
              <div>
                <label class="text-sm font-medium">Last Name</label>
                <input z-input [(ngModel)]="user.lastName" />
              </div>
            </div>
            <div>
              <label class="text-sm font-medium">Bio</label>
              <textarea z-input rows="4" [(ngModel)]="user.bio"></textarea>
            </div>
          </div>
        </z-tab>

        <z-tab zTitle="Security" zValue="security">
          <div class="space-y-4 mt-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">Two-Factor Authentication</h3>
                <p class="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <z-switch [(ngModel)]="user.twoFactorEnabled" />
            </div>
            <button z-button zType="outline">Change Password</button>
          </div>
        </z-tab>

        <z-tab zTitle="Notifications" zValue="notifications">
          <div class="space-y-4 mt-6">
            <h3 class="font-medium">Email Preferences</h3>
            <div class="space-y-3">
              <z-checkbox [(ngModel)]="notifications.marketing">
                Marketing emails
              </z-checkbox>
              <z-checkbox [(ngModel)]="notifications.updates">
                Product updates
              </z-checkbox>
              <z-checkbox [(ngModel)]="notifications.security">
                Security alerts
              </z-checkbox>
            </div>
          </div>
        </z-tab>
      </z-tab-group>
    </div>
  `
})
export class UserProfileTabsComponent {}
```

### 18. Divider

Visual separators.

```typescript
import { ZardDividerComponent } from '@shared/components/divider/divider.component';

// Horizontal divider
<z-divider />

// Vertical divider
<div class="flex h-5 items-center space-x-4">
  <span>Item 1</span>
  <z-divider zOrientation="vertical" />
  <span>Item 2</span>
  <z-divider zOrientation="vertical" />
  <span>Item 3</span>
</div>

// With spacing variants
<z-divider zSpacing="sm" />
<z-divider zSpacing="default" />
<z-divider zSpacing="lg" />

// Settings section with dividers
<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium">Account Settings</h3>
    <p class="text-sm text-muted-foreground">
      Manage your account preferences
    </p>
  </div>

  <z-divider />

  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <label>Email notifications</label>
      <z-switch />
    </div>
    <div class="flex items-center justify-between">
      <label>Public profile</label>
      <z-switch />
    </div>
  </div>

  <z-divider />

  <div>
    <h3 class="text-lg font-medium">Danger Zone</h3>
    <button z-button zType="destructive" class="mt-4">
      Delete Account
    </button>
  </div>
</div>
```

### 19. Table

Data tables with sorting and styling.

```typescript
import { ZardTableModule } from '@shared/components/table/table.module';

// Basic table
<table z-table>
  <thead z-table-header>
    <tr z-table-row>
      <th z-table-head>Name</th>
      <th z-table-head>Email</th>
      <th z-table-head>Role</th>
      <th z-table-head>Status</th>
    </tr>
  </thead>
  <tbody z-table-body>
    @for (user of users; track user.id) {
      <tr z-table-row>
        <td z-table-cell>{{ user.name }}</td>
        <td z-table-cell>{{ user.email }}</td>
        <td z-table-cell>{{ user.role }}</td>
        <td z-table-cell>
          <z-badge [class]="getStatusBadgeClass(user.status)">
            {{ user.status }}
          </z-badge>
        </td>
      </tr>
    }
  </tbody>
</table>

// Invoice table with actions
@Component({
  template: `
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Invoices</h2>
        <button z-button>
          <svg class="w-4 h-4 mr-2"><!-- download icon --></svg>
          Export CSV
        </button>
      </div>

      <table z-table>
        <caption z-table-caption>A list of your recent invoices.</caption>
        <thead z-table-header>
          <tr z-table-row>
            <th z-table-head>Invoice</th>
            <th z-table-head>Status</th>
            <th z-table-head>Method</th>
            <th z-table-head class="text-right">Amount</th>
            <th z-table-head>Actions</th>
          </tr>
        </thead>
        <tbody z-table-body>
          @for (invoice of invoices; track invoice.id) {
            <tr z-table-row>
              <td z-table-cell class="font-medium">{{ invoice.id }}</td>
              <td z-table-cell>
                <z-badge [zType]="getInvoiceStatusType(invoice.status)">
                  {{ invoice.status }}
                </z-badge>
              </td>
              <td z-table-cell>{{ invoice.paymentMethod }}</td>
              <td z-table-cell class="text-right">{{ '$' + invoice.amount }}</td>
              <td z-table-cell>
                <z-dropdown-menu>
                  <button z-dropdown-trigger z-button zType="ghost" zSize="sm">
                    <svg class="w-4 h-4"><!-- more icon --></svg>
                  </button>
                  <z-dropdown-menu-content>
                    <z-dropdown-item (click)="viewInvoice(invoice)">
                      View
                    </z-dropdown-item>
                    <z-dropdown-item (click)="downloadInvoice(invoice)">
                      Download
                    </z-dropdown-item>
                    <z-dropdown-item (click)="shareInvoice(invoice)">
                      Share
                    </z-dropdown-item>
                  </z-dropdown-menu-content>
                </z-dropdown-menu>
              </td>
            </tr>
          }
        </tbody>
        <tfoot z-table-footer>
          <tr z-table-row>
            <td z-table-cell colspan="3">Total</td>
            <td z-table-cell class="text-right font-bold">
              {{ '$' + calculateTotal() }}
            </td>
            <td z-table-cell></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `
})
export class InvoiceTableComponent {}
```

---

## Feedback Components

### 20. Toast

Notification toasts.

```typescript
import { ZardToastComponent } from '@shared/components/toast/toast.component';
import { toast } from 'ngx-sonner';

// Basic toasts
toast('Event has been created');
toast.success('Successfully saved!');
toast.error('Something went wrong');
toast.warning('Please review your input');
toast.info('New update available');

// Toast with action
toast('File uploaded', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo')
  }
});

// Form submission with toast
@Component({
  template: `
    <!-- Toast container -->
    <z-toaster
      position="bottom-right"
      [visibleToasts]="3"
      [duration]="4000"
      [closeButton]="true"
    />

    <form (ngSubmit)="onSubmit()">
      <!-- form fields -->
      <button z-button type="submit">Save Changes</button>
    </form>
  `
})
export class FormWithToastComponent {
  async onSubmit() {
    const loadingToast = toast.loading('Saving changes...');

    try {
      await this.saveData();
      toast.success('Changes saved successfully', {
        id: loadingToast
      });
    } catch (error) {
      toast.error('Failed to save changes', {
        id: loadingToast,
        description: error.message
      });
    }
  }
}

// Copy to clipboard with toast
copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard', {
    description: text,
    duration: 2000
  });
}
```

### 21. Alert Dialog

Confirmation dialogs.

```typescript
import { ZardAlertDialogService } from '@shared/components/alert-dialog/alert-dialog.service';

// Basic confirmation
constructor(private alertDialog: ZardAlertDialogService) {}

async confirmDelete() {
  const result = await this.alertDialog.open({
    zTitle: 'Are you absolutely sure?',
    zDescription: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    zOkText: 'Delete',
    zCancelText: 'Cancel',
    zOkDestructive: true
  });

  if (result) {
    // Perform delete
  }
}

// Custom content dialog
openCustomDialog() {
  this.alertDialog.open({
    zTitle: 'Terms of Service',
    zContent: this.termsTemplate, // TemplateRef
    zOkText: 'I Agree',
    zCancelText: 'Decline',
    zMaskClosable: false
  });
}

// Unsaved changes warning
@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <!-- form fields -->
    </form>
  `
})
export class EditFormComponent implements CanDeactivate<EditFormComponent> {
  async canDeactivate(): Promise<boolean> {
    if (this.form.dirty) {
      const result = await this.alertDialog.open({
        zTitle: 'Unsaved Changes',
        zDescription: 'You have unsaved changes. Are you sure you want to leave?',
        zOkText: 'Leave',
        zCancelText: 'Stay',
        zOkDestructive: true
      });
      return result;
    }
    return true;
  }
}
```

### 22. Dialog

Modal dialogs with custom content.

```typescript
import { ZardDialogService } from '@shared/components/dialog/dialog.service';

// Open component in dialog
openUserDialog() {
  const dialogRef = this.dialog.open(UserFormComponent, {
    zTitle: 'Edit User',
    zWidth: '600px',
    zData: { userId: 123 }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('User saved:', result);
    }
  });
}

// Template-based dialog
@Component({
  template: `
    <ng-template #createProject>
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium">Project Name</label>
          <input z-input [(ngModel)]="projectName" />
        </div>
        <div>
          <label class="text-sm font-medium">Description</label>
          <textarea z-input rows="3" [(ngModel)]="projectDescription"></textarea>
        </div>
      </div>
    </ng-template>

    <button z-button (click)="openCreateDialog()">
      Create Project
    </button>
  `
})
export class ProjectListComponent {
  @ViewChild('createProject') createProjectTemplate!: TemplateRef<any>;

  openCreateDialog() {
    const dialogRef = this.dialog.open({
      zTitle: 'Create New Project',
      zContent: this.createProjectTemplate,
      zFooter: [
        {
          label: 'Cancel',
          type: 'outline',
          onClick: () => dialogRef.close()
        },
        {
          label: 'Create',
          type: 'default',
          onClick: () => this.createProject()
        }
      ]
    });
  }
}
```

---

## Navigation Components

### 23. Breadcrumb

Navigation breadcrumbs.

```typescript
import { ZardBreadcrumbModule } from '@shared/components/breadcrumb/breadcrumb.module';

// Basic breadcrumb
<z-breadcrumb>
  <z-breadcrumb-list>
    <z-breadcrumb-item>
      <z-breadcrumb-link routerLink="/">Home</z-breadcrumb-link>
    </z-breadcrumb-item>
    <z-breadcrumb-separator />
    <z-breadcrumb-item>
      <z-breadcrumb-link routerLink="/products">Products</z-breadcrumb-link>
    </z-breadcrumb-item>
    <z-breadcrumb-separator />
    <z-breadcrumb-item>
      <z-breadcrumb-page>Laptop</z-breadcrumb-page>
    </z-breadcrumb-item>
  </z-breadcrumb-list>
</z-breadcrumb>

// With custom separator
<z-breadcrumb>
  <z-breadcrumb-list>
    <z-breadcrumb-item>
      <z-breadcrumb-link routerLink="/">Home</z-breadcrumb-link>
    </z-breadcrumb-item>
    <z-breadcrumb-separator>
      <svg class="w-4 h-4"><!-- chevron icon --></svg>
    </z-breadcrumb-separator>
    <z-breadcrumb-item>
      <z-breadcrumb-page>Current Page</z-breadcrumb-page>
    </z-breadcrumb-item>
  </z-breadcrumb-list>
</z-breadcrumb>

// Dynamic breadcrumb
@Component({
  template: `
    <z-breadcrumb>
      <z-breadcrumb-list>
        @for (crumb of breadcrumbs; track crumb.url; let last = $last) {
          <z-breadcrumb-item>
            @if (!last) {
              <z-breadcrumb-link [routerLink]="crumb.url">
                {{ crumb.label }}
              </z-breadcrumb-link>
            } @else {
              <z-breadcrumb-page>{{ crumb.label }}</z-breadcrumb-page>
            }
          </z-breadcrumb-item>
          @if (!last) {
            <z-breadcrumb-separator />
          }
        }
      </z-breadcrumb-list>
    </z-breadcrumb>
  `
})
export class DynamicBreadcrumbComponent {
  breadcrumbs = this.route.snapshot.data['breadcrumbs'];
}
```

### 24. Pagination

Page navigation controls.

```typescript
import { ZardPaginationModule } from '@shared/components/pagination/pagination.module';

// Basic pagination
<z-pagination
  [zPageIndex]="currentPage"
  [zTotal]="totalPages"
  (zPageIndexChange)="onPageChange($event)"
/>

// With custom controls
<z-pagination>
  <z-pagination-content>
    <z-pagination-item>
      <z-pagination-button
        zType="previous"
        [disabled]="currentPage === 1"
        (click)="previousPage()"
      />
    </z-pagination-item>

    @for (page of getPageNumbers(); track page) {
      <z-pagination-item>
        <z-pagination-link
          [isActive]="page === currentPage"
          (click)="goToPage(page)"
        >
          {{ page }}
        </z-pagination-link>
      </z-pagination-item>
    }

    <z-pagination-item>
      <z-pagination-button
        zType="next"
        [disabled]="currentPage === totalPages"
        (click)="nextPage()"
      />
    </z-pagination-item>
  </z-pagination-content>
</z-pagination>

// Data table with pagination
@Component({
  template: `
    <div class="space-y-4">
      <table z-table>
        <thead z-table-header>
          <tr z-table-row>
            <th z-table-head>Name</th>
            <th z-table-head>Email</th>
            <th z-table-head>Status</th>
          </tr>
        </thead>
        <tbody z-table-body>
          @for (item of paginatedData; track item.id) {
            <tr z-table-row>
              <td z-table-cell>{{ item.name }}</td>
              <td z-table-cell>{{ item.email }}</td>
              <td z-table-cell>{{ item.status }}</td>
            </tr>
          }
        </tbody>
      </table>

      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} results
        </p>
        <z-pagination
          [zPageIndex]="currentPage"
          [zTotal]="totalPages"
          (zPageIndexChange)="onPageChange($event)"
        />
      </div>
    </div>
  `
})
export class PaginatedTableComponent {
  currentPage = 1;
  itemsPerPage = 10;

  get paginatedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.data.slice(start, start + this.itemsPerPage);
  }
}
```

---

## Overlay Components

### 25. Dropdown Menu

Context menus and dropdowns.

```typescript
import { ZardDropdownModule } from "@shared/components/dropdown/dropdown.module";

// Basic dropdown
<z-dropdown-menu>
  <button z-dropdown-trigger z-button zType="outline">
    Options
  </button>
  <z-dropdown-menu-content>
    <z-dropdown-item>Edit</z-dropdown-item>
    <z-dropdown-item>Duplicate</z-dropdown-item>
    <z-dropdown-item>Archive</z-dropdown-item>
    <z-dropdown-divider />
    <z-dropdown-item class="text-destructive">Delete</z-dropdown-item>
  </z-dropdown-menu-content>
</z-dropdown-menu>;

// User menu dropdown
@Component({
  template: `
    <z-dropdown-menu>
      <button z-dropdown-trigger class="flex items-center space-x-2">
        <z-avatar [zImage]="currentUser.avatar" zSize="sm" />
        <span>{{ currentUser.name }}</span>
        <svg class="w-4 h-4"><!-- chevron down --></svg>
      </button>

      <z-dropdown-menu-content align="end" class="w-56">
        <z-dropdown-label>My Account</z-dropdown-label>
        <z-dropdown-divider />

        <z-dropdown-item (click)="navigateTo('/profile')">
          <svg class="mr-2 h-4 w-4"><!-- user icon --></svg>
          Profile
          <z-dropdown-shortcut>⌘P</z-dropdown-shortcut>
        </z-dropdown-item>

        <z-dropdown-item (click)="navigateTo('/settings')">
          <svg class="mr-2 h-4 w-4"><!-- settings icon --></svg>
          Settings
          <z-dropdown-shortcut>⌘S</z-dropdown-shortcut>
        </z-dropdown-item>

        <z-dropdown-item (click)="navigateTo('/billing')">
          <svg class="mr-2 h-4 w-4"><!-- credit card icon --></svg>
          Billing
        </z-dropdown-item>

        <z-dropdown-divider />

        <z-dropdown-item (click)="logout()" class="text-destructive">
          <svg class="mr-2 h-4 w-4"><!-- logout icon --></svg>
          Log out
          <z-dropdown-shortcut>⌘Q</z-dropdown-shortcut>
        </z-dropdown-item>
      </z-dropdown-menu-content>
    </z-dropdown-menu>
  `,
})
export class UserMenuComponent {}
```

### 26. Popover

Floating content panels.

```typescript
import { ZardPopoverDirective, ZardPopoverComponent } from '@shared/components/popover/popover.component';

// Basic popover
<button
  z-button
  [zPopover]="popoverContent"
  zTrigger="click"
>
  Click me
</button>

<ng-template #popoverContent>
  <z-popover>
    <div class="p-4">
      <h4 class="font-medium">Popover Title</h4>
      <p class="text-sm text-muted-foreground">
        This is the popover content.
      </p>
    </div>
  </z-popover>
</ng-template>

// Form in popover
@Component({
  template: `
    <button
      z-button
      zType="outline"
      [zPopover]="dimensionsForm"
      [(zVisible)]="popoverVisible"
    >
      Set dimensions
    </button>

    <ng-template #dimensionsForm>
      <z-popover>
        <div class="grid gap-4 p-4">
          <div class="space-y-2">
            <h4 class="font-medium leading-none">Dimensions</h4>
            <p class="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div class="grid gap-2">
            <div class="grid grid-cols-3 items-center gap-4">
              <label class="text-sm">Width</label>
              <input z-input type="number" class="col-span-2" [(ngModel)]="width" />
            </div>
            <div class="grid grid-cols-3 items-center gap-4">
              <label class="text-sm">Height</label>
              <input z-input type="number" class="col-span-2" [(ngModel)]="height" />
            </div>
          </div>
          <button z-button (click)="applyDimensions()">Apply</button>
        </div>
      </z-popover>
    </ng-template>
  `
})
export class DimensionsPopoverComponent {}
```

### 27. Tooltip

Hover tooltips.

```typescript
import { ZardTooltipDirective } from '@shared/components/tooltip/tooltip';

// Basic tooltip
<button z-button zTooltip="This is a tooltip">
  Hover me
</button>

// Different positions
<button zTooltip="Top tooltip" zPosition="top">Top</button>
<button zTooltip="Bottom tooltip" zPosition="bottom">Bottom</button>
<button zTooltip="Left tooltip" zPosition="left">Left</button>
<button zTooltip="Right tooltip" zPosition="right">Right</button>

// Icon buttons with tooltips
<div class="flex gap-2">
  <button z-button zType="ghost" zSize="icon" zTooltip="Edit">
    <svg class="h-4 w-4"><!-- edit icon --></svg>
  </button>
  <button z-button zType="ghost" zSize="icon" zTooltip="Delete">
    <svg class="h-4 w-4"><!-- trash icon --></svg>
  </button>
  <button z-button zType="ghost" zSize="icon" zTooltip="Share">
    <svg class="h-4 w-4"><!-- share icon --></svg>
  </button>
</div>

// Status indicators with tooltips
<div class="flex items-center gap-2">
  <div class="h-3 w-3 rounded-full bg-green-500"
       zTooltip="System operational">
  </div>
  <span>All systems operational</span>
</div>
```

### 28. Command

Command palette interface.

```typescript
import { ZardCommandModule } from "@shared/components/command/command.module";

// Basic command palette
<z-command>
  <z-command-input placeholder="Type a command or search..." />
  <z-command-list>
    <z-command-empty>No results found.</z-command-empty>

    <z-command-option-group heading="Suggestions">
      <z-command-option value="calendar">Calendar</z-command-option>
      <z-command-option value="emoji">Search Emoji</z-command-option>
      <z-command-option value="calculator">Calculator</z-command-option>
    </z-command-option-group>

    <z-command-divider />

    <z-command-option-group heading="Settings">
      <z-command-option value="profile">Profile</z-command-option>
      <z-command-option value="billing">Billing</z-command-option>
      <z-command-option value="settings">Settings</z-command-option>
    </z-command-option-group>
  </z-command-list>
</z-command>;

// Global command palette
@Component({
  template: `
    <z-dialog [(visible)]="commandPaletteOpen">
      <z-command class="rounded-lg border shadow-md">
        <z-command-input placeholder="Type a command or search..." [(ngModel)]="searchQuery" />
        <z-command-list>
          <z-command-empty>No results found.</z-command-empty>

          @for (group of filteredCommands; track group.name) {
          <z-command-option-group [heading]="group.name">
            @for (cmd of group.commands; track cmd.id) {
            <z-command-option [value]="cmd.id" (click)="executeCommand(cmd)">
              <svg class="mr-2 h-4 w-4"><!-- icon --></svg>
              {{ cmd.label }}
              @if (cmd.shortcut) {
              <span class="ml-auto text-xs">{{ cmd.shortcut }}</span>
              }
            </z-command-option>
            }
          </z-command-option-group>
          }
        </z-command-list>
      </z-command>
    </z-dialog>
  `,
})
export class CommandPaletteComponent {
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      this.commandPaletteOpen = true;
    }
  }
}
```

---

## Advanced Components

### 29. Toggle & Toggle Group

Toggle buttons and groups.

```typescript
import { ZardToggleComponent } from '@shared/components/toggle/toggle.component';
import { ZardToggleGroupComponent } from '@shared/components/toggle-group/toggle-group.component';

// Single toggle
<z-toggle [(ngModel)]="isBold">
  <svg class="h-4 w-4"><!-- bold icon --></svg>
</z-toggle>

// Text formatting toolbar
<z-toggle-group zMode="multiple" [(ngModel)]="formatting">
  <z-toggle zValue="bold" zAriaLabel="Toggle bold">
    <svg class="h-4 w-4"><!-- bold icon --></svg>
  </z-toggle>
  <z-toggle zValue="italic" zAriaLabel="Toggle italic">
    <svg class="h-4 w-4"><!-- italic icon --></svg>
  </z-toggle>
  <z-toggle zValue="underline" zAriaLabel="Toggle underline">
    <svg class="h-4 w-4"><!-- underline icon --></svg>
  </z-toggle>
</z-toggle-group>

// View mode switcher
<z-toggle-group
  zMode="single"
  zType="outline"
  [(ngModel)]="viewMode"
  (valueChange)="onViewModeChange($event)"
>
  <z-toggle zValue="grid">
    <svg class="h-4 w-4 mr-2"><!-- grid icon --></svg>
    Grid
  </z-toggle>
  <z-toggle zValue="list">
    <svg class="h-4 w-4 mr-2"><!-- list icon --></svg>
    List
  </z-toggle>
  <z-toggle zValue="kanban">
    <svg class="h-4 w-4 mr-2"><!-- kanban icon --></svg>
    Kanban
  </z-toggle>
</z-toggle-group>
```

### 30. Segmented Control

Segmented selection control.

```typescript
import { ZardSegmentedComponent } from '@shared/components/segmented/segmented.component';

// Basic segmented control
<z-segmented
  [zOptions]="options"
  [(ngModel)]="selectedOption"
/>

// View switcher
@Component({
  template: `
    <div class="space-y-4">
      <z-segmented
        [zOptions]="viewOptions"
        [zDefaultValue]="'overview'"
        (zChange)="onViewChange($event)"
      />

      <div [ngSwitch]="currentView">
        <div *ngSwitchCase="'overview'">
          <!-- Overview content -->
        </div>
        <div *ngSwitchCase="'analytics'">
          <!-- Analytics content -->
        </div>
        <div *ngSwitchCase="'reports'">
          <!-- Reports content -->
        </div>
      </div>
    </div>
  `
})
export class ViewSwitcherComponent {
  viewOptions = [
    { label: 'Overview', value: 'overview', icon: 'icon-home' },
    { label: 'Analytics', value: 'analytics', icon: 'icon-chart' },
    { label: 'Reports', value: 'reports', icon: 'icon-file' }
  ];
  currentView = 'overview';
}
```

### 31. Calendar

Full calendar component.

```typescript
import { ZardCalendarComponent } from '@shared/components/calendar/calendar.component';

// Basic calendar
<z-calendar
  [(value)]="selectedDate"
  (dateChange)="onDateSelect($event)"
/>

// With min/max dates
<z-calendar
  [minDate]="minDate"
  [maxDate]="maxDate"
  [(value)]="selectedDate"
/>

// Event calendar
@Component({
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="font-medium mb-4">Select a date</h3>
        <z-calendar
          [(value)]="selectedDate"
          (dateChange)="loadEventsForDate($event)"
        />
      </div>

      <div>
        <h3 class="font-medium mb-4">
          Events for {{ selectedDate | date:'mediumDate' }}
        </h3>
        <div class="space-y-2">
          @if (eventsLoading) {
            <z-skeleton class="h-20" />
            <z-skeleton class="h-20" />
          } @else {
            @for (event of events; track event.id) {
              <z-card>
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium">{{ event.title }}</h4>
                    <p class="text-sm text-muted-foreground">
                      {{ event.time }}
                    </p>
                  </div>
                  <z-badge>{{ event.type }}</z-badge>
                </div>
              </z-card>
            } @empty {
              <p class="text-muted-foreground">No events for this date</p>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class EventCalendarComponent {}
```

---

## Real-World Examples

### Complete Dashboard

```typescript
@Component({
  template: `
    <div class="min-h-screen bg-background">
      <!-- Header -->
      <header class="border-b">
        <div class="flex h-16 items-center px-4">
          <z-breadcrumb>
            <z-breadcrumb-list>
              <z-breadcrumb-item>
                <z-breadcrumb-link routerLink="/dashboard">Dashboard</z-breadcrumb-link>
              </z-breadcrumb-item>
              <z-breadcrumb-separator />
              <z-breadcrumb-item>
                <z-breadcrumb-page>Analytics</z-breadcrumb-page>
              </z-breadcrumb-item>
            </z-breadcrumb-list>
          </z-breadcrumb>

          <div class="ml-auto flex items-center space-x-4">
            <z-dropdown-menu>
              <button z-dropdown-trigger class="flex items-center space-x-2">
                <z-avatar [zImage]="currentUser.avatar" zSize="sm" />
              </button>
              <z-dropdown-menu-content align="end">
                <z-dropdown-label>{{ currentUser.email }}</z-dropdown-label>
                <z-dropdown-divider />
                <z-dropdown-item routerLink="/profile">Profile</z-dropdown-item>
                <z-dropdown-item routerLink="/settings">Settings</z-dropdown-item>
                <z-dropdown-divider />
                <z-dropdown-item (click)="logout()">Log out</z-dropdown-item>
              </z-dropdown-menu-content>
            </z-dropdown-menu>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto p-6">
        <!-- Stats Cards -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          @for (stat of stats; track stat.id) {
          <z-card>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">
                  {{ stat.title }}
                </p>
                <p class="text-2xl font-bold">{{ stat.value }}</p>
                <p class="text-xs text-muted-foreground">
                  <span [class.text-green-600]="stat.change > 0" [class.text-red-600]="stat.change < 0"> {{ stat.change > 0 ? "+" : "" }}{{ stat.change }}% </span>
                  from last month
                </p>
              </div>
              <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg class="h-6 w-6 text-primary"><!-- icon --></svg>
              </div>
            </div>
          </z-card>
          }
        </div>

        <!-- Charts and Tables -->
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Chart Card -->
          <z-card zTitle="Revenue Overview">
            <z-tabs>
              <z-tab zTitle="Daily" zValue="daily">
                <!-- Chart component -->
              </z-tab>
              <z-tab zTitle="Weekly" zValue="weekly">
                <!-- Chart component -->
              </z-tab>
              <z-tab zTitle="Monthly" zValue="monthly">
                <!-- Chart component -->
              </z-tab>
            </z-tabs>
          </z-card>

          <!-- Recent Transactions -->
          <z-card zTitle="Recent Transactions">
            <div class="space-y-4">
              @if (transactionsLoading) { @for (i of [1,2,3,4]; track i) {
              <div class="flex items-center space-x-4">
                <z-skeleton class="h-10 w-10 rounded-full" />
                <div class="space-y-2 flex-1">
                  <z-skeleton class="h-4 w-[200px]" />
                  <z-skeleton class="h-3 w-[150px]" />
                </div>
              </div>
              } } @else { @for (transaction of recentTransactions; track transaction.id) {
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <z-avatar [zImage]="transaction.avatar" zSize="sm" />
                  <div>
                    <p class="text-sm font-medium">{{ transaction.name }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ transaction.date | date : "short" }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium" [class.text-green-600]="transaction.amount > 0" [class.text-red-600]="transaction.amount < 0">{{ transaction.amount > 0 ? "+" : "" }}{{ "$" + abs(transaction.amount) }}</p>
                  <z-badge zType="outline" class="text-xs">
                    {{ transaction.status }}
                  </z-badge>
                </div>
              </div>
              } }
            </div>
          </z-card>
        </div>

        <!-- Data Table -->
        <z-card zTitle="Orders" class="mt-6">
          <div class="space-y-4">
            <!-- Filters -->
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <input z-input type="search" placeholder="Search orders..." [(ngModel)]="searchQuery" />
              </div>
              <z-select placeholder="Status" [(ngModel)]="filterStatus">
                <z-select-item value="all" label="All Status" />
                <z-select-item value="pending" label="Pending" />
                <z-select-item value="processing" label="Processing" />
                <z-select-item value="completed" label="Completed" />
              </z-select>
              <z-date-picker placeholder="Select date" [(ngModel)]="filterDate" />
              <button z-button zType="outline">
                <svg class="h-4 w-4 mr-2"><!-- download icon --></svg>
                Export
              </button>
            </div>

            <!-- Table -->
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
                @for (order of filteredOrders; track order.id) {
                <tr z-table-row>
                  <td z-table-cell>
                    <z-checkbox />
                  </td>
                  <td z-table-cell class="font-medium">#{{ order.id }}</td>
                  <td z-table-cell>
                    <div class="flex items-center space-x-2">
                      <z-avatar [zImage]="order.customer.avatar" zSize="sm" />
                      <span>{{ order.customer.name }}</span>
                    </div>
                  </td>
                  <td z-table-cell>{{ order.product }}</td>
                  <td z-table-cell>
                    <z-badge [zType]="getStatusType(order.status)">
                      {{ order.status }}
                    </z-badge>
                  </td>
                  <td z-table-cell class="text-right">
                    {{ "$" + order.amount }}
                  </td>
                  <td z-table-cell>
                    <z-dropdown-menu>
                      <button z-dropdown-trigger z-button zType="ghost" zSize="sm">
                        <svg class="h-4 w-4"><!-- more icon --></svg>
                      </button>
                      <z-dropdown-menu-content>
                        <z-dropdown-item>View</z-dropdown-item>
                        <z-dropdown-item>Edit</z-dropdown-item>
                        <z-dropdown-divider />
                        <z-dropdown-item class="text-destructive"> Delete </z-dropdown-item>
                      </z-dropdown-menu-content>
                    </z-dropdown-menu>
                  </td>
                </tr>
                }
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex items-center justify-between">
              <p class="text-sm text-muted-foreground">Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalOrders }} orders</p>
              <z-pagination [zPageIndex]="currentPage" [zTotal]="totalPages" (zPageIndexChange)="onPageChange($event)" />
            </div>
          </div>
        </z-card>
      </main>

      <!-- Toast Container -->
      <z-toaster position="bottom-right" />
    </div>
  `,
})
export class DashboardComponent {}
```

This comprehensive guide covers all Zard Angular components with multiple real-world examples for each. The components follow consistent patterns and can be easily integrated into any Angular application. Each example demonstrates practical usage scenarios and best practices for building modern web applications.
