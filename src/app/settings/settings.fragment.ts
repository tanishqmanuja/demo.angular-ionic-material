export abstract class SettingsFragment {
  abstract title: string;

  static isValid(component: unknown): component is SettingsFragment {
    return (
      component !== null &&
      typeof component === "object" &&
      "title" in component &&
      typeof component.title === "string"
    );
  }
}
