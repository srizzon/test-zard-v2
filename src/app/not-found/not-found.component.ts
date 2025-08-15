import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardCardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardCardComponent],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center px-4">
      <z-card class="max-w-md w-full text-center">
        <div class="space-y-6 py-8">
          <!-- 404 Illustration -->
          <div class="mx-auto w-32 h-32 bg-muted rounded-full flex items-center justify-center">
            <svg class="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          
          <!-- Error Message -->
          <div>
            <h1 class="text-6xl font-bold text-muted-foreground mb-4">404</h1>
            <h2 class="text-2xl font-bold mb-2">Page Not Found</h2>
            <p class="text-muted-foreground mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <!-- Actions -->
          <div class="space-y-3">
            <button z-button zFull="true" routerLink="/dashboard">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Go to Dashboard
            </button>
            
            <button z-button zType="outline" zFull="true" (click)="goBack()">
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </z-card>
    </div>
  `
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}