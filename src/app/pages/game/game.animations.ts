import { group, query, transition, trigger, style } from '@angular/animations';
import {
  bounceInAnimate,
  bounceOutAnimate,
  slideDownInAnimate,
  slideUpOutAnimate,
} from '@design';

export const overlayAnimation = trigger('overlays', [
  transition('* <=> *', [
    query(
      '.overlay:not(.create-account):enter',
      style({ opacity: 0, transform: 'translate(-50%, -50%)' }),
      {
        optional: true,
      },
    ),

    group([
      query(
        '.overlay.create-account:leave',
        slideUpOutAnimate('translateX(-50%)'),
        { optional: true },
      ),
      query(
        '.overlay:not(.create-account):leave',
        bounceOutAnimate('translate(-50%, -50%)'),
        {
          optional: true,
        },
      ),
    ]),
    query(
      '.overlay:not(.create-account):enter',
      bounceInAnimate('translate(-50%, -50%)'),
      {
        optional: true,
      },
    ),
    query(
      '.overlay.create-account:enter',
      slideDownInAnimate('translateX(-50%)'),
      { optional: true },
    ),
  ]),
]);
