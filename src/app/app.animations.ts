import {
  animate,
  animateChild,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const installerAnimation = trigger('installer', [
  state(
    'void',
    style({
      opacity: 0,
      transform: 'scale(0)',
    }),
  ),
  state(
    '*',
    style({
      opacity: 1,
      transform: '*',
    }),
  ),
  transition(':enter, :leave', animate('750ms ease-in-out')),
]);