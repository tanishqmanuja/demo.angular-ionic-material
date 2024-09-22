import { hexFromArgb } from "@material/material-color-utilities";

import {
  createTokenApplier,
  CreateTokenApplierOptions,
  createTokenParser,
} from "../../dom/tokens";
import { Scheme } from "../scheme";

const LAYER = "tokens.material";

const tokenizer = createTokenParser({
  prefix: "md-sys-color",
});

const DEFAULT_APPLIER_OPTS = {
  layer: LAYER,
  key: LAYER,
} satisfies CreateTokenApplierOptions;

export function applyMaterialTokens(
  scheme: Scheme,
  applierOpts: CreateTokenApplierOptions = {},
) {
  const tokens = Object.fromEntries(
    Object.entries(scheme.toJSON()).map(([key, value]) => {
      return [tokenizer(key), hexFromArgb(value)];
    }),
  );

  const applier = createTokenApplier({
    ...DEFAULT_APPLIER_OPTS,
    ...applierOpts,
  });
  applier(tokens);
}
