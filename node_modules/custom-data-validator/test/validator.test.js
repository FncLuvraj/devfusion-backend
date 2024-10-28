// test/validator.test.js

const { Validator, autoTrim, normalizeEmail } = require("../lib/validator");

test("should trim leading and trailing spaces from a string", () => {
  expect(autoTrim("  Hello World  ")).toBe("Hello World");
});

test("should normalize email by trimming and converting to lowercase", () => {
  expect(normalizeEmail("   John.Doe@Example.com  ")).toBe(
    "john.doe@example.com"
  );
});

describe("Validator Class", () => {
  test("should validate required fields", () => {
    const rules = { email: ["required", "validateEmail"] };
    const data = { email: " john.doe@example.com " };
    const validator = new Validator(rules);
    const isValid = validator.validate(data);
    expect(isValid).toBe(true);
    expect(validator.getErrors()).toEqual({});
  });

  test("should validate email format and trim spaces", () => {
    const rules = { email: ["required", "validateEmail"] };
    const data = { email: " john.doe@example " }; // Invalid email
    const validator = new Validator(rules);
    const isValid = validator.validate(data);
    expect(isValid).toBe(false);
    expect(validator.getErrors()).toHaveProperty("email");
  });
});
