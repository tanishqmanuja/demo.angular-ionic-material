type ApplyStylesOptions = {
  target?: HTMLElement;
  key?: string;
};
export function applyStyles(
  cssString: string,
  options: ApplyStylesOptions = {},
) {
  const { target: targetEl = document.head, key } = options;

  if (key) {
    targetEl.querySelector(`style[data-key="${key}"]`)?.remove();
  }

  const styleEl = document.createElement("style");

  if (key) {
    styleEl.dataset["key"] = key;
  }

  styleEl.appendChild(document.createTextNode(cssString));
  targetEl.appendChild(styleEl);
}
