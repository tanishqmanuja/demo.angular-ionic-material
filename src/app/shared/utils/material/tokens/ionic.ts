import { hexFromArgb } from "@material/material-color-utilities";
import {
  Color,
  generateColor,
  generateSteppedColors,
} from "@tqman/ionic-color-utilities";

import {
  createTokenApplier,
  CreateTokenApplierOptions,
  createTokenParser,
} from "../../dom/tokens";
import { Scheme } from "../scheme";

const LAYER = "tokens.ionic";

const tokenizer = createTokenParser({
  prefix: "ion",
});

const DEFAULT_APPLIER_OPTS = {
  layer: LAYER,
  key: LAYER,
} satisfies CreateTokenApplierOptions;

export function applyIonicTokens(
  scheme: Scheme,
  applierOpts: CreateTokenApplierOptions = {},
) {
  const tokens: Record<string, string> = {};

  // Application Colors
  const appColors = {
    background: hexFromArgb(scheme.background),
    text: hexFromArgb(scheme.onBackground),
    border: hexFromArgb(scheme.outline),
  };

  const textClr = new Color(appColors.text);
  const backgroundClr = new Color(appColors.background);
  const borderClr = new Color(appColors.border);

  tokens["textColor"] = textClr.hex;
  tokens["textColorRgb"] = textClr.toList();

  tokens["backgroundColor"] = backgroundClr.hex;
  tokens["backgroundColorRgb"] = backgroundClr.toList();

  tokens["borderColor"] = borderClr.hex;

  // Stepped Colors
  const textSteppedColors = generateSteppedColors(
    appColors.background,
    appColors.text,
  );

  const backgroundSteppedColors = generateSteppedColors(
    appColors.text,
    appColors.background,
  );

  Object.entries(textSteppedColors).forEach(([key, value]) => {
    tokens[`textColorStep${key}`] = value;
  });

  Object.entries(backgroundSteppedColors).forEach(([key, value]) => {
    tokens[`backgroundColorStep${key}`] = value;
  });

  // Theme Colors
  const themeColors = {
    primary: hexFromArgb(scheme.primary),
    secondary: hexFromArgb(scheme.secondary),
    tertiary: hexFromArgb(scheme.tertiary),
    danger: hexFromArgb(scheme.error),
    light: hexFromArgb(scheme.onSurface),
    medium: hexFromArgb(scheme.outline),
    dark: hexFromArgb(scheme.surface),
  };

  Object.entries(themeColors).forEach(([clrName, clrValue]) => {
    clrName = clrName.charAt(0).toUpperCase() + clrName.slice(1);
    const clr = generateColor(clrValue);

    tokens[`color${clrName}`] = clr.value;
    tokens[`color${clrName}Rgb`] = clr.valueRgb;
    tokens[`color${clrName}Contrast`] = clr.contrast;
    tokens[`color${clrName}ContrastRgb`] = clr.contrastRgb;
    tokens[`color${clrName}Tint`] = clr.tint;
    tokens[`color${clrName}Shade`] = clr.shade;
  });

  const applier = createTokenApplier({
    ...DEFAULT_APPLIER_OPTS,
    ...applierOpts,
  });
  applier(
    Object.fromEntries(
      Object.entries(tokens).map(([k, v]) => [tokenizer(k), v]),
    ),
  );
}
