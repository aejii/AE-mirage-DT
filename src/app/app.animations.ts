import { query, style, transition, trigger } from '@angular/animations';
import {
  bounceInAnimate,
  bounceOutAnimate,
} from '@design';

export const appAnimation = trigger('app', [
  transition('true => false', [
    query('mg-game', style({ opacity: 0 })),
    query('mg-installer', bounceOutAnimate()),
    query('mg-game', bounceInAnimate()),
  ]),
  transition('void => true', [
    query('mg-installer', style({ opacity: 0 })),
    query('mg-installer', bounceInAnimate()),
  ]),
  transition('false => true', [
    query('mg-installer', style({ opacity: 0 })),
    query('mg-game', bounceOutAnimate()),
    query('mg-installer', bounceInAnimate()),
  ]),
]);
