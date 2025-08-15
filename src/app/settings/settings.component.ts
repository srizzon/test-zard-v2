import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZardSwitchComponent } from '../shared/components/switch/switch.component';
import { ZardCardComponent } from '../shared/components/card/card.component';

interface NotificationSettings {
  escalas: boolean;
  lembretesEscalas: boolean;
  trocasEscalas: boolean;
  cadastroMinisterios: boolean;
  desativarTodas: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ZardSwitchComponent,
    ZardCardComponent
  ],
  template: `
    <div class="container mx-auto p-6 max-w-4xl">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-semibold">Configurações</h1>
      </div>

      <!-- Navigation tabs -->
      <div class="flex gap-1 mb-8 border-b">
        <button class="px-4 py-2 text-sm font-medium border-b-2 border-primary text-primary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          Notificações
        </button>
      </div>

      <!-- Content -->
      <z-card class="mb-6">
        <div class="space-y-6">
          <h2 class="text-xl font-semibold">Notificações no WhatsApp</h2>

          <!-- Escalas -->
          <div class="flex items-start justify-between py-4 border-b">
            <div class="space-y-1">
              <h3 class="font-medium">Escalas</h3>
              <p class="text-sm text-muted-foreground">
                Você receberá notificações quando for escalado para um evento.
              </p>
            </div>
            <z-switch 
              [(ngModel)]="notificationSettings.escalas"
              (checkChange)="onSettingChange('escalas', $event)"
            ></z-switch>
          </div>

          <!-- Lembretes de escalas -->
          <div class="flex items-start justify-between py-4 border-b">
            <div class="space-y-1">
              <h3 class="font-medium">Lembretes de escalas</h3>
              <p class="text-sm text-muted-foreground">
                Você receberá uma notificação antes de um evento que você está escalado.
              </p>
            </div>
            <z-switch 
              [(ngModel)]="notificationSettings.lembretesEscalas"
              (checkChange)="onSettingChange('lembretesEscalas', $event)"
            ></z-switch>
          </div>

          <!-- Trocas de escalas -->
          <div class="flex items-start justify-between py-4 border-b">
            <div class="space-y-1">
              <h3 class="font-medium">Trocas de escalas</h3>
              <p class="text-sm text-muted-foreground">
                Você receberá notificações relacionadas a trocas de escalas.
              </p>
            </div>
            <z-switch 
              [(ngModel)]="notificationSettings.trocasEscalas"
              (checkChange)="onSettingChange('trocasEscalas', $event)"
            ></z-switch>
          </div>

          <!-- Cadastro em ministérios -->
          <div class="flex items-start justify-between py-4 border-b">
            <div class="space-y-1">
              <h3 class="font-medium">Cadastro em ministérios</h3>
              <p class="text-sm text-muted-foreground">
                Você receberá notificações relacionadas a aprovação do seu cadastro.
              </p>
            </div>
            <z-switch 
              [(ngModel)]="notificationSettings.cadastroMinisterios"
              (checkChange)="onSettingChange('cadastroMinisterios', $event)"
            ></z-switch>
          </div>

          <!-- Desativar todas as notificações -->
          <div class="flex items-start justify-between py-4">
            <div class="space-y-1">
              <h3 class="font-medium">Desativar todas as notificações</h3>
              <p class="text-sm text-muted-foreground">
                Ao desativar, você não receberá mais nenhuma notificação.
              </p>
            </div>
            <z-switch 
              [(ngModel)]="notificationSettings.desativarTodas"
              (checkChange)="onToggleAll($event)"
              [class]="notificationSettings.desativarTodas ? '' : 'opacity-50'"
            ></z-switch>
          </div>
        </div>
      </z-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: hsl(var(--background));
    }
  `]
})
export class SettingsComponent {
  notificationSettings: NotificationSettings = {
    escalas: true,
    lembretesEscalas: true,
    trocasEscalas: true,
    cadastroMinisterios: true,
    desativarTodas: false
  };

  onSettingChange(key: keyof NotificationSettings, value: boolean): void {
    console.log(`Setting ${key} changed to:`, value);
    
    if (this.notificationSettings.desativarTodas && key !== 'desativarTodas') {
      return;
    }

    this.notificationSettings[key] = value;

    if (key !== 'desativarTodas' && value === true) {
      this.notificationSettings.desativarTodas = false;
    }
  }

  onToggleAll(value: boolean): void {
    console.log('Toggle all notifications:', !value);
    
    this.notificationSettings.desativarTodas = !value;
    
    if (!value) {
      this.notificationSettings.escalas = false;
      this.notificationSettings.lembretesEscalas = false;
      this.notificationSettings.trocasEscalas = false;
      this.notificationSettings.cadastroMinisterios = false;
    } else {
      this.notificationSettings.escalas = true;
      this.notificationSettings.lembretesEscalas = true;
      this.notificationSettings.trocasEscalas = true;
      this.notificationSettings.cadastroMinisterios = true;
    }
  }
}