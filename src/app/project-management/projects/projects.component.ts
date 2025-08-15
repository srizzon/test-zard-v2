import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZardCardComponent } from '@shared/components/card/card.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterModule, ZardCardComponent, ZardButtonComponent],
  template: `
    <div class="container mx-auto px-6 py-8">
      <z-card>
        <h1 class="text-2xl font-bold mb-4">Projects</h1>
        <p class="text-muted-foreground mb-4">Project management page - coming soon!</p>
        <button z-button routerLink="/dashboard">Back to Dashboard</button>
      </z-card>
    </div>
  `
})
export class ProjectsComponent {}