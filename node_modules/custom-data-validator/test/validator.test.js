const Validator = require("../lib/validator");

describe("Validator Class", () => {
  test("should validate required fields", () => {
    const rules = { username: ["required"] };
    const data = {};
    const validator = new Validator(rules);
    const isValid = validator.validate(data);
    expect(isValid).toBe(false);
    expect(validator.getErrors()).toHaveProperty("username");
  });

  test("should validate string type", () => {
    const rules = { username: ["string"] };
    const data = { username: 123 };
    const validator = new Validator(rules);
    validator.validate(data);
    expect(validator.getErrors()).toHaveProperty("username");
  });

  test("should pass validation with correct data", () => {
    const rules = { age: ["required", "number"] };
    const data = { age: 25 };
    const validator = new Validator(rules);
    const isValid = validator.validate(data);
    expect(isValid).toBe(true);
    expect(validator.getErrors()).toEqual({});
  });

  test("should handle custom validators", () => {
    const rules = { code: ["required", "isEven"] };
    const data = { code: 3 };
    const validator = new Validator(rules);
    validator.addCustomValidator("isEven", (field, value, param, instance) => {
      if (value % 2 !== 0) {
        instance.addError(field, `${field} must be an even number.`);
      }
    });
    const isValid = validator.validate(data);
    expect(isValid).toBe(false);
    expect(validator.getErrors()).toHaveProperty("code");
  });
});
