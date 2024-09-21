export function getIntersectionRatioY(
  element1: HTMLElement,
  element2: HTMLElement,
) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  const intersectionHeight = Math.max(
    0,
    Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top),
  );

  const height1 = rect1.bottom - rect1.top;
  const height2 = rect2.bottom - rect2.top;

  return intersectionHeight / Math.min(height1, height2);
}
