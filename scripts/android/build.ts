import { $, argv } from "bun";

// This directory gets cleared on every ng build :)
const DEST_DIR = "dist/mobile/android";

const isDebug = argv.includes("--debug") ? true : false;

await $`cd android && ./gradlew clean assemble${isDebug ? "Debug" : "Release"}`;

await $`mkdir -p ${DEST_DIR}`;
await $`cp android/app/build/outputs/apk/release/app-release*.apk ${DEST_DIR}/`;
