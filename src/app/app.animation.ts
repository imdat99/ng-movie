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
            opacity: '0%',
          }),
          animate(
            '0.5s ease-in-out',
            style({
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
            opacity: '100%',
          }),
          animate(
            '0.3s ease-in-out',
            style({
              opacity: '0%',
            })
          ),
        ],
        { optional: true }
      ),
    ]),
  ]),
]);
