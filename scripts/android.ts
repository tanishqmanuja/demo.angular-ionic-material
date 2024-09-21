import { $, argv, env } from "bun";

const isLive = argv.includes("--live") ? "true" : "false";

const CAP_SERVER_ENABLED = process.env["CAP_SERVER_ENABLED"] ?? isLive;
const CAP_SERVER_URL = process.env["CAP_SERVER_URL"];

env["CAP_SERVER_ENABLED"] ??= CAP_SERVER_ENABLED;

if (CAP_SERVER_ENABLED === "true" && !CAP_SERVER_URL) {
  console.log(
    "⚠️ CAP_SERVER_URL is not set. Please set it in your environment variables.",
  );
}

if (CAP_SERVER_ENABLED === "true") {
  console.log(`√ Live mode is enabled with server url ${CAP_SERVER_URL}`);
}

await $`bunx cap run android`;
