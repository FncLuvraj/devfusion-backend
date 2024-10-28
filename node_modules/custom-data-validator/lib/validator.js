// Utility functions (defined outside the class)
function autoTrim(value) {
  return typeof value === "string" ? value.trim() : value;
}

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : value;
}

class Validator {
  constructor(rules = {}) {
    this.rules = rules;
    this.errors = {};
    this.customValidators = {};
  }

  addCustomValidator(name, fn) {
    if (typeof fn !== "function") {
      throw new Error("Custom validator must be a function.");
    }
    this.customValidators[name] = fn;
  }

  // Email validation with normalization
  validateEmail(fieldName, email) {
    email = normalizeEmail(email); // Normalize the email input
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      this.addError(fieldName, `${fieldName} is not a valid email`);
      return false;
    }
    return true;
  }

  validate(data = {}) {
    this.errors = {};
    for (let field in this.rules) {
      let fieldRules = this.rules[field];
      let value = data[field];

      // Auto trim before validation
      value = autoTrim(value);

      for (let rule of fieldRules) {
        let [ruleName, ruleParam] = rule.split(":");
        ruleParam = ruleParam || null;
        if (this[ruleName]) {
          this[ruleName](field, value, ruleParam);
        } else if (this.customValidators[ruleName]) {
          this.customValidators[ruleName](field, value, ruleParam, this);
        } else {
          throw new Error(`Unknown validation rule: ${ruleName}`);
        }
      }
    }
    return Object.keys(this.errors).length === 0;
  }

  addError(field, message) {
    if (!this.errors[field]) {
      this.errors[field] = [];
    }
    this.errors[field].push(message);
  }

  getErrors() {
    return this.errors;
  }

  // Built-in validation methods
  required(field, value) {
    if (value === undefined || value === null || value === "") {
      this.addError(field, `${field} is required.`);
    }
  }

  string(field, value) {
    if (value !== undefined && typeof value !== "string") {
      this.addError(field, `${field} must be a string.`);
    }
  }

  number(field, value) {
    if (value !== undefined && typeof value !== "number") {
      this.addError(field, `${field} must be a number.`);
    }
  }

  boolean(field, value) {
    if (value !== undefined && typeof value !== "boolean") {
      this.addError(field, `${field} must be a boolean.`);
    }
  }

  minLength(field, value, length) {
    if (value !== undefined && value.length < parseInt(length)) {
      this.addError(
        field,
        `${field} must be at least ${length} characters long.`
      );
    }
  }

  maxLength(field, value, length) {
    if (value !== undefined && value.length > parseInt(length)) {
      this.addError(
        field,
        `${field} must be no more than ${length} characters long.`
      );
    }
  }

  regex(field, value, pattern) {
    if (value !== undefined) {
      let regex = new RegExp(pattern);
      if (!regex.test(value)) {
        this.addError(field, `${field} does not match the required pattern.`);
      }
    }
  }
}

module.exports = { Validator, autoTrim, normalizeEmail };
