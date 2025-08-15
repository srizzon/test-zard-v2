import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardInputDirective } from '@shared/components/input/input.directive';
import { ZardCheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { ZardAlertComponent } from '@shared/components/alert/alert.component';
import { ZardLoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardInputDirective,
    ZardCheckboxComponent,
    ZardDividerComponent,
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
            <h1 class="text-4xl font-bold tracking-tight">Welcome back</h1>
            <p class="text-xl text-muted-foreground">Sign in to your account to continue</p>
          </div>
        </div>

        <!-- Login Form Card -->
        <z-card zTitle="Sign in to your account" zDescription="Enter your credentials below to access your account">
          @if (errorMessage()) {
            <z-alert 
              zType="error" 
              zTitle="Login Failed" 
              [zDescription]="errorMessage()"
              class="mb-6"
            />
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">Email address</label>
                <input 
                  z-input 
                  formControlName="email" 
                  type="email" 
                  placeholder="Enter your email address"
                  [zStatus]="getFieldStatus('email')"
                />
                @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']) {
                  <p class="text-sm text-destructive mt-1">Email is required</p>
                }
                @if (loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']) {
                  <p class="text-sm text-destructive mt-1">Please enter a valid email</p>
                }
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">Password</label>
                <div class="relative">
                  <input 
                    z-input 
                    formControlName="password" 
                    [type]="showPassword() ? 'text' : 'password'"
                    placeholder="Enter your password"
                    [zStatus]="getFieldStatus('password')"
                  />
                  <button 
                    type="button"
                    class="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    (click)="togglePasswordVisibility()"
                  >
                    @if (showPassword()) {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.05 8.05m1.828 1.828l4.242 4.242m0 0L15.95 15.95"/>
                      </svg>
                    } @else {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    }
                  </button>
                </div>
                @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
                  <p class="text-sm text-destructive mt-1">Password is required</p>
                }
                @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['minlength']) {
                  <p class="text-sm text-destructive mt-1">Password must be at least 6 characters</p>
                }
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <z-checkbox formControlName="rememberMe">
                Remember me for 30 days
              </z-checkbox>
              <a 
                routerLink="/auth/forgot-password" 
                class="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            <div class="space-y-4 pt-2">
              <button 
                z-button 
                type="submit" 
                zFull="true"
                zSize="lg"
                [disabled]="loginForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <z-loader zSize="sm" class="mr-2" />
                  Signing in...
                } @else {
                  Sign in to your account
                }
              </button>
            </div>
          </form>

          <z-divider class="my-8">
            <span class="text-xs text-muted-foreground bg-card px-2">OR CONTINUE WITH</span>
          </z-divider>

          <!-- Social Login Options -->
          <div class="space-y-3">
            <button 
              z-button 
              zType="outline" 
              zFull="true"
              zSize="lg"
              (click)="loginWithGoogle()"
              [disabled]="isLoading()"
            >
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button 
              z-button 
              zType="outline" 
              zFull="true"
              zSize="lg"
              (click)="loginWithGithub()"
              [disabled]="isLoading()"
            >
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
        </z-card>

        <!-- Footer Navigation -->
        <div class="text-center space-y-4">
          <p class="text-base text-muted-foreground">
            Don't have an account? 
            <a routerLink="/auth/register" class="text-primary hover:underline font-semibold">
              Create account
            </a>
          </p>
          
          <p class="text-xs text-muted-foreground leading-relaxed">
            By signing in, you agree to our 
            <a href="#" class="underline hover:text-foreground">Terms of Service</a> 
            and 
            <a href="#" class="underline hover:text-foreground">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Reactive state
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  // Form
  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  getFieldStatus(fieldName: string): 'success' | 'warning' | 'error' | null | undefined {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.errors) {
      return 'error';
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      try {
        const { email, password, rememberMe } = this.loginForm.value;
        
        // Simulate API call
        await this.simulateLogin(email, password, rememberMe);
        
        // Navigate to dashboard on success
        this.router.navigate(['/dashboard']);
        
      } catch (error) {
        this.errorMessage.set(error instanceof Error ? error.message : 'Login failed. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  private async simulateLogin(email: string, password: string, rememberMe: boolean): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate login logic
    if (email === 'demo@example.com' && password === 'password123') {
      // Success - store auth token, user data, etc.
      localStorage.setItem('authToken', 'demo-token-123');
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
    } else {
      throw new Error('Invalid email or password. Try demo@example.com / password123');
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.isLoading.set(true);
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage.set('Google login failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async loginWithGithub(): Promise<void> {
    this.isLoading.set(true);
    try {
      // Simulate GitHub OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage.set('GitHub login failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}