import test from "node:test";
import assert from "node:assert/strict";
import { isNonBlankString, isValidConfidence } from "./validation.js";

test("rejects confidence outside the range 1-5", () => {
  assert.equal(isValidConfidence(0), false);
  assert.equal(isValidConfidence(6), false);
  assert.equal(isValidConfidence(3), true);
});

test("rejects blank text and accepts non-blank text", () => {
  assert.equal(isNonBlankString("   "), false);
  assert.equal(isNonBlankString(""), false);
  assert.equal(isNonBlankString("React"), true);
});
