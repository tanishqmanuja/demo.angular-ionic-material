import { filter, Observable, switchMap } from "rxjs";

export function waitFor<S, N>(
  notifier$: Observable<N>,
  predicate: (source: N) => boolean = Boolean,
): (source$: Observable<S>) => Observable<S> {
  return (source$: Observable<S>) =>
    notifier$.pipe(
      filter(predicate),
      switchMap(() => source$),
    );
}
