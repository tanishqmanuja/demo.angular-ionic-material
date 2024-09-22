export function dashcase(str: string) {
  return str
    .replace(/([a-z])([A-Z]|[0-9])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}
