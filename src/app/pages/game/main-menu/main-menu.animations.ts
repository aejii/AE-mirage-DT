import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const mainMenuAnimation = trigger('mainMenu', [
  state(
    'false',
    style({
      left: '{{ offset }}px',
    }),
    {
      params: {
        offset: 0,
      },
    },
  ),
  state(
    'true',
    style({
      left: 0,
    }),
  ),
  transition('false <=> true', animate('250ms ease-in-out')),
]);
