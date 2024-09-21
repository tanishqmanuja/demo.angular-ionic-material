import { Observable } from "rxjs";

export function fromIntersectionObserver(
  element: Element,
  options: IntersectionObserverInit = {
    root: null,
    threshold: 0.5,
  },
) {
  return new Observable<IntersectionObserverEntry>(subscriber => {
    const observer = new IntersectionObserver(([entry]) => {
      subscriber.next(entry);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  });
}
