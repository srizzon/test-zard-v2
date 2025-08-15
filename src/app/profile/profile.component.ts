import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardTabGroupComponent, ZardTabComponent } from '@shared/components/tabs/tabs.component';
import { ZardAvatarComponent } from '@shared/components/avatar/avatar.component';
import { ZardSwitchComponent } from '@shared/components/switch/switch.component';
import { ZardSelectComponent } from '@shared/components/select/select.component';
import { ZardSelectItemComponent } from '@shared/components/select/select-item.component';
import { ZardDatePickerComponent } from '@shared/components/date-picker/date-picker.component';
import { ZardBadgeComponent } from '@shared/components/badge/badge.component';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { ZardAlertComponent } from '@shared/components/alert/alert.component';
import { ZardTableModule } from '@shared/components/table/table.module';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  company: string;
  role: string;
  location: string;
  website: string;
  birthDate: Date | null;
  avatar: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  weeklyDigest: boolean;
  monthlyReport: boolean;
}

interface SecurityLog {
  id: string;
  action: string;
  device: string;
  location: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'warning';
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardInputDirective,
    ZardTabGroupComponent,
    ZardTabComponent,
    ZardAvatarComponent,
    ZardSwitchComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardDatePickerComponent,
    ZardBadgeComponent,
    ZardDividerComponent,
    ZardAlertComponent,
    ZardTableModule,
    ZardDropdownModule
  ],
  template: `
    <div class="min-h-screen bg-background">
      <div class="container mx-auto px-6 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight">My Profile</h1>
          <p class="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        <!-- Profile Header Card -->
        <z-card class="mb-8">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div class="relative">
              <z-avatar
                [zImage]="{ url: userProfile().avatar, alt: userProfile().firstName + ' ' + userProfile().lastName, fallback: getInitials() }"
                zSize="lg"
              />
              <button
                z-button
                zSize="sm"
                zType="outline"
                class="absolute -bottom-2 -right-2"
                (click)="uploadAvatar()"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
            </div>

            <div class="flex-1">
              <h2 class="text-2xl font-bold">{{ userProfile().firstName }} {{ userProfile().lastName }}</h2>
              <p class="text-muted-foreground">{{ userProfile().role }} at {{ userProfile().company }}</p>
              <p class="text-sm text-muted-foreground mt-1">{{ userProfile().email }}</p>

              <div class="flex items-center gap-4 mt-4">
                <z-badge zType="outline">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ userProfile().location }}
                </z-badge>

                @if (userProfile().website) {
                  <z-badge zType="outline">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                    Website
                  </z-badge>
                }
              </div>
            </div>

            <div class="flex gap-2">
              <button z-button zType="outline">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                Share Profile
              </button>
            </div>
          </div>
        </z-card>

        <!-- Tabs Content -->
        <z-tab-group>
          <!-- Profile Information Tab -->
          <z-tab label="Profile">
            <div class="grid gap-6 md:grid-cols-2">
              <!-- Personal Information -->
              <z-card zTitle="Personal Information" zDescription="Update your personal details">
                <form [formGroup]="profileForm" class="space-y-4 mt-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-sm font-medium">First Name</label>
                      <input z-input formControlName="firstName" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label class="text-sm font-medium">Last Name</label>
                      <input z-input formControlName="lastName" placeholder="Enter last name" />
                    </div>
                  </div>

                  <div>
                    <label class="text-sm font-medium">Email</label>
                    <input z-input formControlName="email" type="email" placeholder="Enter email address" />
                  </div>

                  <div>
                    <label class="text-sm font-medium">Phone</label>
                    <input z-input formControlName="phone" type="tel" placeholder="Enter phone number" />
                  </div>

                  <div>
                    <label class="text-sm font-medium">Bio</label>
                    <textarea z-input formControlName="bio" rows="4" placeholder="Tell us about yourself"></textarea>
                  </div>

                  <button z-button type="submit" [disabled]="profileForm.invalid">
                    Save Changes
                  </button>
                </form>
              </z-card>

              <!-- Professional Information -->
              <z-card zTitle="Professional Information" zDescription="Your work and career details">
                <form [formGroup]="professionalForm" class="space-y-4 mt-6">
                  <div>
                    <label class="text-sm font-medium">Company</label>
                    <input z-input formControlName="company" placeholder="Enter company name" />
                  </div>

                  <div>
                    <label class="text-sm font-medium">Job Title</label>
                    <input z-input formControlName="role" placeholder="Enter job title" />
                  </div>

                  <div>
                    <label class="text-sm font-medium">Location</label>
                    <z-select formControlName="location" placeholder="Select location">
                      <z-select-item value="new-york" label="New York, NY" />
                      <z-select-item value="los-angeles" label="Los Angeles, CA" />
                      <z-select-item value="chicago" label="Chicago, IL" />
                      <z-select-item value="houston" label="Houston, TX" />
                      <z-select-item value="phoenix" label="Phoenix, AZ" />
                      <z-select-item value="philadelphia" label="Philadelphia, PA" />
                      <z-select-item value="san-antonio" label="San Antonio, TX" />
                      <z-select-item value="san-diego" label="San Diego, CA" />
                      <z-select-item value="dallas" label="Dallas, TX" />
                      <z-select-item value="san-jose" label="San Jose, CA" />
                    </z-select>
                  </div>

                  <div>
                    <label class="text-sm font-medium">Website</label>
                    <input z-input formControlName="website" type="url" placeholder="https://example.com" />
                  </div>

                  <div>
                    <label class="text-sm font-medium">Birth Date</label>
                    <z-date-picker formControlName="birthDate" placeholder="Select birth date" />
                  </div>

                  <button z-button type="submit" [disabled]="professionalForm.invalid">
                    Save Changes
                  </button>
                </form>
              </z-card>
            </div>
          </z-tab>

          <!-- Security Tab -->
          <z-tab label="Security">
            <div class="space-y-6">
              <z-alert
                zType="info"
                zTitle="Account Security"
                zDescription="Keep your account secure by enabling two-factor authentication and using a strong password."
              />

              <div class="grid gap-6 md:grid-cols-2">
                <!-- Password Settings -->
                <z-card zTitle="Password" zDescription="Change your account password">
                  <form [formGroup]="passwordForm" class="space-y-4 mt-6">
                    <div>
                      <label class="text-sm font-medium">Current Password</label>
                      <input z-input formControlName="currentPassword" type="password" placeholder="Enter current password" />
                    </div>

                    <div>
                      <label class="text-sm font-medium">New Password</label>
                      <input z-input formControlName="newPassword" type="password" placeholder="Enter new password" />
                    </div>

                    <div>
                      <label class="text-sm font-medium">Confirm Password</label>
                      <input z-input formControlName="confirmPassword" type="password" placeholder="Confirm new password" />
                    </div>

                    <button z-button type="submit" [disabled]="passwordForm.invalid">
                      Update Password
                    </button>
                  </form>
                </z-card>

                <!-- Two-Factor Authentication -->
                <z-card zTitle="Two-Factor Authentication" zDescription="Add an extra layer of security">
                  <div class="space-y-6 mt-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium">SMS Authentication</h4>
                        <p class="text-sm text-muted-foreground">
                          Receive verification codes via SMS
                        </p>
                      </div>
                      <z-switch [(ngModel)]="securitySettings().smsAuth" />
                    </div>

                    <z-divider />

                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="font-medium">Authenticator App</h4>
                        <p class="text-sm text-muted-foreground">
                          Use an authenticator app for codes
                        </p>
                      </div>
                      <z-switch [(ngModel)]="securitySettings().authenticatorApp" />
                    </div>

                    @if (securitySettings().authenticatorApp) {
                      <div class="p-4 bg-muted/50 rounded-lg">
                        <h5 class="font-medium mb-2">Setup Instructions</h5>
                        <ol class="text-sm text-muted-foreground space-y-1">
                          <li>1. Download an authenticator app</li>
                          <li>2. Scan the QR code below</li>
                          <li>3. Enter the 6-digit code</li>
                        </ol>
                        <div class="mt-4 p-4 bg-background border rounded flex items-center justify-center">
                          <p class="text-sm text-muted-foreground">[QR Code Placeholder]</p>
                        </div>
                      </div>
                    }
                  </div>
                </z-card>
              </div>

              <!-- Recent Security Activity -->
              <z-card zTitle="Recent Security Activity" zDescription="Monitor your account access">
                <div class="mt-6">
                  <div class="rounded-md border">
                    <table z-table>
                      <thead z-table-header>
                        <tr z-table-row>
                          <th z-table-head>Activity</th>
                          <th z-table-head>Device</th>
                          <th z-table-head>Location</th>
                          <th z-table-head>Date</th>
                          <th z-table-head>Status</th>
                        </tr>
                      </thead>
                      <tbody z-table-body>
                        @for (log of securityLogs(); track log.id) {
                          <tr z-table-row>
                            <td z-table-cell class="font-medium">{{ log.action }}</td>
                            <td z-table-cell>{{ log.device }}</td>
                            <td z-table-cell>{{ log.location }}</td>
                            <td z-table-cell>{{ log.timestamp | date:'short' }}</td>
                            <td z-table-cell>
                              <z-badge [zType]="getSecurityStatusType(log.status)">
                                {{ log.status | titlecase }}
                              </z-badge>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </z-card>
            </div>
          </z-tab>

          <!-- Notifications Tab -->
          <z-tab label="Notifications">
            <z-card zTitle="Notification Preferences" zDescription="Choose how you want to be notified">
              <div class="space-y-6 mt-6">
                <div>
                  <h4 class="font-medium mb-4">Email Notifications</h4>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Account Activity</p>
                        <p class="text-sm text-muted-foreground">Get notified about important account changes</p>
                      </div>
                      <z-switch [(ngModel)]="notifications().emailNotifications" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Marketing Updates</p>
                        <p class="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                      </div>
                      <z-switch [(ngModel)]="notifications().marketingEmails" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Security Alerts</p>
                        <p class="text-sm text-muted-foreground">Important security notifications and alerts</p>
                      </div>
                      <z-switch [(ngModel)]="notifications().securityAlerts" />
                    </div>
                  </div>
                </div>

                <z-divider />

                <div>
                  <h4 class="font-medium mb-4">Push Notifications</h4>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Browser Notifications</p>
                        <p class="text-sm text-muted-foreground">Show notifications in your browser</p>
                      </div>
                      <z-switch [(ngModel)]="notifications().pushNotifications" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">SMS Notifications</p>
                        <p class="text-sm text-muted-foreground">Receive important updates via SMS</p>
                      </div>
                      <z-switch [(ngModel)]="notifications().smsNotifications" />
                    </div>
                  </div>
                </div>

                <z-divider />

                <div>
                  <h4 class="font-medium mb-4">Reports & Digests</h4>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Weekly Digest</p>
                        <p class="text-sm text-muted-foreground">Weekly summary of your account activity</p>
                      </div>
                      <z-switch [(ngModel)]="notifications().weeklyDigest" />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium">Monthly Report</p>
                        <p class="text-sm text-muted-foreground">Monthly analytics and insights</p>
                      </div>
                      <z-switch [(ngModel)]="notifications().monthlyReport" />
                    </div>
                  </div>
                </div>

                <div class="pt-4">
                  <button z-button (click)="saveNotificationSettings()">
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </z-card>
          </z-tab>

          <!-- Privacy Tab -->
          <z-tab label="Privacy">
            <div class="space-y-6">
              <z-alert
                zType="warning"
                zTitle="Privacy Settings"
                zDescription="These settings control how your information is shared and used. Changes may take up to 24 hours to take effect."
              />

              <z-card zTitle="Profile Visibility" zDescription="Control who can see your profile information">
                <div class="space-y-4 mt-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Public Profile</p>
                      <p class="text-sm text-muted-foreground">Make your profile visible to everyone</p>
                    </div>
                    <z-switch [(ngModel)]="privacySettings().publicProfile" />
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Show Email</p>
                      <p class="text-sm text-muted-foreground">Display your email address on your public profile</p>
                    </div>
                    <z-switch [(ngModel)]="privacySettings().showEmail" />
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Show Activity</p>
                      <p class="text-sm text-muted-foreground">Display your recent activity to others</p>
                    </div>
                    <z-switch [(ngModel)]="privacySettings().showActivity" />
                  </div>
                </div>
              </z-card>

              <z-card zTitle="Data & Analytics" zDescription="Control how your data is used for analytics">
                <div class="space-y-4 mt-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Usage Analytics</p>
                      <p class="text-sm text-muted-foreground">Help us improve by sharing usage data</p>
                    </div>
                    <z-switch [(ngModel)]="privacySettings().analytics" />
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Personalized Ads</p>
                      <p class="text-sm text-muted-foreground">Show ads based on your activity</p>
                    </div>
                    <z-switch [(ngModel)]="privacySettings().personalizedAds" />
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium">Data Export</p>
                      <p class="text-sm text-muted-foreground">Download all your data</p>
                    </div>
                    <button z-button zType="outline" zSize="sm">
                      Request Export
                    </button>
                  </div>
                </div>
              </z-card>

              <z-card zTitle="Account Deletion" zDescription="Permanently delete your account and all data">
                <div class="mt-6 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h4 class="font-medium text-destructive mb-2">Danger Zone</h4>
                  <p class="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                  <button z-button zType="destructive" (click)="initiateAccountDeletion()">
                    Delete Account
                  </button>
                </div>
              </z-card>
            </div>
          </z-tab>
        </z-tab-group>
      </div>
    </div>
  `
})
export class ProfileComponent {
  private fb = inject(FormBuilder);

  // User profile data
  userProfile = signal<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate software developer with 5+ years of experience in full-stack development. Love working with Angular, TypeScript, and modern web technologies.',
    company: 'Tech Corp Inc.',
    role: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    birthDate: new Date('1990-05-15'),
    avatar: '/assets/avatar.jpg'
  });

  // Notification settings
  notifications = signal<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    weeklyDigest: true,
    monthlyReport: false
  });

  // Security settings
  securitySettings = signal({
    smsAuth: false,
    authenticatorApp: true
  });

  // Privacy settings
  privacySettings = signal({
    publicProfile: true,
    showEmail: false,
    showActivity: true,
    analytics: true,
    personalizedAds: false
  });

  // Security logs
  securityLogs = signal<SecurityLog[]>([
    {
      id: '1',
      action: 'Account Login',
      device: 'MacBook Pro - Chrome',
      location: 'San Francisco, CA',
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'success'
    },
    {
      id: '2',
      action: 'Password Change',
      device: 'iPhone - Safari',
      location: 'San Francisco, CA',
      timestamp: new Date('2024-01-14T15:45:00'),
      status: 'success'
    },
    {
      id: '3',
      action: 'Failed Login Attempt',
      device: 'Unknown Device',
      location: 'New York, NY',
      timestamp: new Date('2024-01-13T09:20:00'),
      status: 'failed'
    },
    {
      id: '4',
      action: '2FA Setup',
      device: 'MacBook Pro - Chrome',
      location: 'San Francisco, CA',
      timestamp: new Date('2024-01-12T14:15:00'),
      status: 'success'
    }
  ]);

  // Form groups
  profileForm: FormGroup;
  professionalForm: FormGroup;
  passwordForm: FormGroup;

  constructor() {
    const profile = this.userProfile();

    this.profileForm = this.fb.group({
      firstName: [profile.firstName, Validators.required],
      lastName: [profile.lastName, Validators.required],
      email: [profile.email, [Validators.required, Validators.email]],
      phone: [profile.phone],
      bio: [profile.bio]
    });

    this.professionalForm = this.fb.group({
      company: [profile.company],
      role: [profile.role],
      location: [profile.location],
      website: [profile.website, Validators.pattern(/^https?:\/\/.*/)],
      birthDate: [profile.birthDate]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  getInitials(): string {
    const profile = this.userProfile();
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  }

  getSecurityStatusType(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  }

  uploadAvatar(): void {
    // Implement avatar upload logic
    console.log('Uploading avatar...');
  }

  saveNotificationSettings(): void {
    // Implement save notification settings logic
    console.log('Saving notification settings...', this.notifications());
  }

  initiateAccountDeletion(): void {
    // Implement account deletion logic with confirmation dialog
    console.log('Initiating account deletion...');
  }
}
