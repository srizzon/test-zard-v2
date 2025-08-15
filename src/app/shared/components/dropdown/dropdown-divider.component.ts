import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'clsx';

import { mergeClasses } from '@shared/utils/merge-classes';

@Component({
  selector: 'z-dropdown-menu-divider, [z-dropdown-menu-divider]',
  exportAs: 'zDropdownMenuDivider',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: ``,
  host: {
    '[class]': 'classes()',
    role: 'separator',
    'aria-orientation': 'horizontal',
  },
})
export class ZardDropdownMenuDividerComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      'h-px bg-border mx-1 my-1',
      this.class(),
    ),
  );
}