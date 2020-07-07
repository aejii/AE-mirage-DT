import { animate, keyframes, style } from '@angular/animations';

const bezierIn = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
const bezierOut = 'cubic-bezier(0.645, 0, 0.785, 0.39)';
const bounceAnimationDuration = '750ms';

export function bounceInAnimate(transformExtension = '') {
  return animate(
    `${bounceAnimationDuration} ${bezierIn}`,
    keyframes([
      style({
        offset: 0,
        opacity: 0,
        transform: transformExtension + ' scale3d(0.3, 0.3, 0.3)',
      }),
      style({
        offset: 0.2,
        opacity: 0,
        transform: transformExtension + ' scale3d(1.1, 1.1, 1.1)',
      }),
      style({
        offset: 0.4,
        opacity: 0,
        transform: transformExtension + ' scale3d(0.9, 0.9, 0.9)',
      }),
      style({
        offset: 0.6,
        opacity: 1,
        transform: transformExtension + ' scale3d(1.03, 1.03, 1.03)',
      }),
      style({
        offset: 0.8,
        opacity: 1,
        transform: transformExtension + ' scale3d(0.97, 0.97, 0.97)',
      }),
      style({
        offset: 1,
        opacity: 1,
        transform: transformExtension + ' scale3d(1, 1, 1)',
      }),
    ]),
  );
}

export function bounceOutAnimate(transformExtension = '') {
  return animate(
    `${bounceAnimationDuration} ${bezierOut}`,
    keyframes([
      style({
        offset: 0,
        opacity: 1,
        transform: transformExtension + ' scale3d(1, 1, 1)',
      }),
      style({
        offset: 0.2,
        opacity: 1,
        transform: transformExtension + ' scale3d(0.97, 0.97, 0.97)',
      }),
      style({
        offset: 0.4,
        opacity: 1,
        transform: transformExtension + ' scale3d(1.03, 1.03, 1.03)',
      }),
      style({
        offset: 0.6,
        opacity: 0,
        transform: transformExtension + ' scale3d(0.9, 0.9, 0.9)',
      }),
      style({
        offset: 0.8,
        opacity: 0,
        transform: transformExtension + ' scale3d(1.1, 1.1, 1.1)',
      }),
      style({
        offset: 1,
        opacity: 0,
        transform: transformExtension + ' scale3d(0.3, 0.3, 0.3)',
      }),
    ]),
  );
}

export function slideDownInAnimate(transformExtension = '') {
  return animate(
    `${bounceAnimationDuration} ${bezierIn}`,
    keyframes([
      style({
        offset: 0,
        opacity: 0,
        transform: `translate3d(0, -3000px, 0) scaleY(3) ${transformExtension}`,
      }),
      style({
        offset: 0.6,
        opacity: 1,
        transform: `translate3d(0, 25px, 0) scaleY(0.9) ${transformExtension}`,
      }),
      style({
        offset: 0.75,
        transform: `translate3d(0, -10px, 0) scaleY(0.95) ${transformExtension}`,
      }),
      style({
        offset: 0.9,
        transform: `translate3d(0, 5px, 0) scaleY(0.985) ${transformExtension}`,
      }),
      style({
        offset: 1,
        transform: `translate3d(0, 0, 0) scaleY(1) ${transformExtension}`,
      }),
    ]),
  );
}

export function slideUpOutAnimate(transformExtension = '') {
  return animate(
    `${bounceAnimationDuration} ${bezierOut}`,
    keyframes([
      style({
        offset: 0,
        transform: `translate3d(0, 0, 0) scaleY(1) ${transformExtension}`,
      }),
      style({
        offset: 0.1,
        transform: `translate3d(0, 5px, 0) scaleY(0.985) ${transformExtension}`,
      }),
      style({
        offset: 0.25,
        transform: `translate3d(0, -10px, 0) scaleY(0.95) ${transformExtension}`,
      }),
      style({
        offset: 0.4,
        opacity: 1,
        transform: `translate3d(0, 25px, 0) scaleY(0.9) ${transformExtension}`,
      }),
      style({
        offset: 1,
        opacity: 0,
        transform: `translate3d(0, -3000px, 0) scaleY(3) ${transformExtension}`,
      }),
    ]),
  );
}
