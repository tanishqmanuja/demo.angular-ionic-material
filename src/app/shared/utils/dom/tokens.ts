import { dashcase } from "../strings/case";
import { applyStyles } from "./styles";

export type TokenParser = (str: string) => string;

export type CreateTokenParserOptions = {
  prefix?: string;
  suffix?: string;
  parser?: TokenParser;
};

export const TOKEN_PARSER_DEFAULT_OPTIONS = {
  parser: dashcase,
} satisfies CreateTokenParserOptions;

export function createTokenParser(
  options: CreateTokenParserOptions,
): TokenParser {
  const opts = { ...TOKEN_PARSER_DEFAULT_OPTIONS, ...options };

  opts.prefix = opts.prefix ? dashcase(opts.prefix) + "-" : "";
  opts.suffix = opts.suffix ? "-" + dashcase(opts.suffix) : "";

  return (key: string) => `${opts.prefix}${opts.parser(key)}${opts.suffix}`;
}

export type CreateTokenApplierOptions = {
  target?: HTMLElement;
  key?: string;
  selector?: string;
  layer?: string;
};

export const TOKEN_APPLIER_DEFAULT_OPTIONS = {
  target: document.head,
  selector: ":root",
} satisfies CreateTokenApplierOptions;

export function createTokenApplier(options: CreateTokenApplierOptions) {
  const opts = { ...TOKEN_APPLIER_DEFAULT_OPTIONS, ...options };

  const scopes: string[] = [];

  if (opts.layer) {
    scopes.push(`@layer ${opts.layer}`);
  }
  if (opts.selector) {
    scopes.push(opts.selector);
  }

  return (tokens: Record<string, string>) => {
    let str = "";

    scopes.forEach(scope => {
      str += `${scope} { `;
    });

    str += Object.entries(tokens)
      .map(
        ([key, value]) =>
          `${key.startsWith("--") ? "" : "--"}${key}: ${value};`,
      )
      .join(" ");

    str += " " + "}".repeat(scopes.length);

    applyStyles(str, { target: opts.target, key: opts.key });
  };
}
