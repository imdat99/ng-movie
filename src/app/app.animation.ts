import {
  trigger,
  animate,
  transition,
  style,
  group,
  query,
} from '@angular/animations';

export const slideInAnimation = trigger('slideInAnimation', [
  // Transition between any two states
  transition('* <=> *', [
    // Events to apply
    // Defined style and animation function to apply
    // Config object with optional set to true to handle when element not yet added to the DOM
    query(
      ':enter, :leave',
      style({
        position: 'fixed',
        width: '100%',
        zIndex: 2,
        background: 'var(--background-color)',
      }),
      { optional: true }
    ),
    // group block executes in parallel
    group([
      query(
        ':enter',
        [
          style({
            height: '100vh',
            // transform: 'scale(1)',
            // transform: 'translateY(100%)',
            opacity: '0%',
          }),
          animate(
            '0.5s ease-in-out',
            style({
              // transform: 'scale(0)',
              // transform: 'translatey(0%)',
              opacity: '100%',
            })
          ),
        ],
        { optional: true }
      ),
      query(
        ':leave',
        [
          style({
            // transform: 'scale(0)',
            // transform: 'translateX(0%)',
            opacity: '100%',
          }),
          animate(
            '0.3s ease-in-out',
            style({
              // transform: 'scale(1)',
              // transform: 'translateX(-100%)',
              opacity: '0%',
            })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);
