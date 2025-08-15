import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardAlertComponent } from '@shared/components/alert/alert.component';
import { ZardLoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardInputDirective,
    ZardAlertComponent,
    ZardLoaderComponent
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div class="w-full max-w-lg space-y-8">
        <!-- Logo/Brand Section -->
        <div class="text-center space-y-6">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full shadow-lg">
            <svg class="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div class="space-y-2">
            <h1 class="text-4xl font-bold tracking-tight">Forgot your password?</h1>
            <p class="text-xl text-muted-foreground">No worries, we'll send you reset instructions</p>
          </div>
        </div>

        <!-- Reset Password Form Card -->
        <z-card zTitle="Reset your password" zDescription="Enter your email address and we'll send you a link to reset your password">
          @if (successMessage()) {
            <z-alert 
              zType="success" 
              zTitle="Reset link sent!" 
              [zDescription]="successMessage()"
              class="mb-6"
            />
          }

          @if (errorMessage()) {
            <z-alert 
              zType="error" 
              zTitle="Unable to send reset link" 
              [zDescription]="errorMessage()"
              class="mb-6"
            />
          }

          @if (!emailSent()) {
            <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">Email Address</label>
                <input 
                  z-input 
                  formControlName="email" 
                  type="email" 
                  placeholder="Enter your email address"
                  [zStatus]="getFieldStatus('email')"
                />
                @if (resetForm.get('email')?.touched && resetForm.get('email')?.errors?.['required']) {
                  <p class="text-sm text-destructive mt-1">Email is required</p>
                }
                @if (resetForm.get('email')?.touched && resetForm.get('email')?.errors?.['email']) {
                  <p class="text-sm text-destructive mt-1">Please enter a valid email</p>
                }
              </div>

              <button 
                z-button 
                type="submit" 
                zFull="true"
                zSize="lg"
                [disabled]="resetForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <z-loader zSize="sm" class="mr-2" />
                  Sending reset link...
                } @else {
                  Send reset link
                }
              </button>
            </form>
          } @else {
            <!-- Success State -->
            <div class="text-center space-y-6">
              <div class="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <div class="space-y-2">
                <h3 class="text-2xl font-semibold">Check your email</h3>
                <p class="text-base text-muted-foreground">
                  We sent a password reset link to<br>
                  <span class="font-semibold text-foreground">{{ resetForm.get('email')?.value }}</span>
                </p>
              </div>
            </div>
          }

          @if (emailSent()) {
            <div class="mt-8 text-center space-y-4">
              <p class="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or
              </p>
              <button 
                z-button 
                zType="outline" 
                zSize="lg"
                (click)="resendEmail()"
                [disabled]="isLoading() || resendCooldown() > 0"
              >
                @if (resendCooldown() > 0) {
                  Resend in {{ resendCooldown() }}s
                } @else if (isLoading()) {
                  <z-loader zSize="sm" class="mr-2" />
                  Resending...
                } @else {
                  Resend email
                }
              </button>
            </div>
          }
        </z-card>

        <!-- Footer Navigation -->
        <div class="text-center space-y-4">
          <p class="text-base text-muted-foreground">
            Remember your password? 
            <a routerLink="/auth/login" class="text-primary hover:underline font-semibold">
              Back to sign in
            </a>
          </p>
          
          <p class="text-xs text-muted-foreground">
            Having trouble? 
            <a href="mailto:support@example.com" class="underline hover:text-foreground">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);

  // Reactive state
  isLoading = signal(false);
  emailSent = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  resendCooldown = signal(0);

  // Form
  resetForm: FormGroup;

  constructor() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getFieldStatus(fieldName: string): 'success' | 'warning' | 'error' | null | undefined {
    const field = this.resetForm.get(fieldName);
    if (field?.touched && field?.errors) {
      return 'error';
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.resetForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      try {
        const email = this.resetForm.get('email')?.value;
        
        // Simulate API call
        await this.simulatePasswordReset(email);
        
        this.emailSent.set(true);
        this.successMessage.set(`We've sent a password reset link to ${email}. Please check your inbox and follow the instructions to reset your password.`);
        
      } catch (error) {
        this.errorMessage.set(error instanceof Error ? error.message : 'Failed to send reset email. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async resendEmail(): Promise<void> {
    if (this.resetForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      try {
        const email = this.resetForm.get('email')?.value;
        
        // Simulate API call
        await this.simulatePasswordReset(email);
        
        this.successMessage.set(`Reset link resent to ${email}`);
        this.startResendCooldown();
        
      } catch (error) {
        this.errorMessage.set(error instanceof Error ? error.message : 'Failed to resend email. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  private async simulatePasswordReset(email: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate reset logic
    if (email === 'blocked@example.com') {
      throw new Error('This email address is temporarily blocked. Please contact support.');
    }
    
    // Success case - would typically send reset email
    console.log('Password reset requested for:', email);
  }

  private startResendCooldown(): void {
    this.resendCooldown.set(60);
    const interval = setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        clearInterval(interval);
        this.resendCooldown.set(0);
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }
}