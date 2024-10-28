# Custom Data Validator

[![npm version](https://img.shields.io/npm/v/custom-data-validator.svg)](https://www.npmjs.com/package/custom-data-validator))
[![license](https://img.shields.io/npm/l/custom-data-validator.svg)](https://github.com/yourusername/custom-data-validator/blob/main/LICENSE)
[![Build Status](https://img.shields.io/travis/yourusername/custom-data-validator.svg)](https://travis-ci.com/yourusername/custom-data-validator)
[![Downloads](https://img.shields.io/npm/dt/custom-data-validator.svg)](https://www.npmjs.com/package/custom-data-validator)

A flexible and lightweight data validation library for Node.js applications.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Defining Validation Rules](#defining-validation-rules)
  - [Available Validation Rules](#available-validation-rules)
  - [Custom Validators](#custom-validators)
  - [Error Handling](#error-handling)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Custom Validation Function](#custom-validation-function)
- [API Reference](#api-reference)
  - [Validator Class](#validator-class)
  - [Built-in Validation Methods](#built-in-validation-methods)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Simple and Intuitive API**: Define validation rules with minimal code.
- **Built-in Validation Rules**: Common validations like required fields, data types, length constraints, and pattern matching.
- **Custom Validation Support**: Easily add your own validation functions.
- **Detailed Error Messages**: Provides clear and customizable error messages.
- **Chainable Rules**: Apply multiple validation rules to a single field.
- **Field-wise Validation**: Validates each field independently for precise error reporting.

## Installation

Install the package via npm:

```bash
npm install custom-data-validator

const Validator = require('custom-data-validator');

const rules = {
  username: ['required', 'string', 'minLength:3', 'maxLength:15'],
  email: ['required', 'string', 'regex:^\\S+@\\S+\\.\\S+$'],
  age: ['number'],
  isAdmin: ['boolean']
};

const data = {
  username: 'john_doe',
  email: 'john@example.com',
  age: 28,
  isAdmin: false
};

const validator = new Validator(rules);
const isValid = validator.validate(data);

if (isValid) {
  console.log('Validation passed!');
} else {
  console.log('Validation errors:', validator.getErrors());
}

Usage

Defining Validation Rules

Validation rules are defined as an object where each key corresponds to a field in your data, and the value is an array of validation rules to apply to that field.

const rules = {
  fieldName: ['rule1', 'rule2:param', 'customRule']
};
	fieldName: The name of the field in your data object.
	•	rule1, rule2:param: Validation rules to apply to the field.

Available Validation Rules

	•	required: The field must be present and not empty.
	•	string: The field must be a string.
	•	number: The field must be a number.
	•	boolean: The field must be a boolean.
	•	array: The field must be an array.
	•	object: The field must be an object.
	•	minLength:X: The string or array must be at least X characters/items long.
	•	maxLength:X: The string or array must be no more than X characters/items long.
	•	regex:pattern: The string must match the provided regular expression pattern.

Custom Validators

You can add your own custom validation functions to extend the validator’s capabilities.
validator.addCustomValidator('isEven', (field, value, param, validatorInstance) => {
  if (value % 2 !== 0) {
    validatorInstance.addError(field, `${field} must be an even number.`);
  }
});

const rules = {
  code: ['required', 'number', 'isEven']
};

const data = { code: 3 };

validator.rules = rules;
const isValid = validator.validate(data);

if (!isValid) {
  console.log(validator.getErrors());
}
Error Handling

The validator collects errors for each field during validation. Use validator.getErrors() to retrieve the errors.
if (!isValid) {
  const errors = validator.getErrors();
  console.log(errors);
  // Output:
  // {
  //   code: ['code must be an even number.']
  // }
}
Examples

Basic Usage
const Validator = require('custom-data-validator');

const rules = {
  name: ['required', 'string', 'minLength:2'],
  email: ['required', 'string', 'regex:^\\S+@\\S+\\.\\S+$'],
  password: ['required', 'string', 'minLength:6'],
  age: ['number'],
  termsAccepted: ['required', 'boolean']
};

const data = {
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret123',
  age: 30,
  termsAccepted: true
};

const validator = new Validator(rules);
const isValid = validator.validate(data);

if (isValid) {
  console.log('All data is valid!');
} else {
  console.error('Validation errors:', validator.getErrors());
}

Custom Validation Function

// Custom validator to check if a number is positive
validator.addCustomValidator('isPositive', (field, value, param, validatorInstance) => {
  if (value <= 0) {
    validatorInstance.addError(field, `${field} must be a positive number.`);
  }
});

const rules = {
  amount: ['required', 'number', 'isPositive']
};

const data = { amount: -5 };

validator.rules = rules;
const isValid = validator.validate(data);

if (!isValid) {
  console.log(validator.getErrors());
  // Output:
  // {
  //   amount: ['amount must be a positive number.']
  // }
}

API Reference

Validator Class

Constructor
const validator = new Validator(rules);

	•	rules: An object defining validation rules for each field.

Methods

	•	validate(data): Validates the provided data against the rules.
	•	data: The data object to validate.
	•	Returns: true if validation passes, false otherwise.
	•	getErrors(): Retrieves the errors collected during validation.
	•	Returns: An object where keys are field names and values are arrays of error messages.
	•	addCustomValidator(name, function): Adds a custom validation function.
	•	name: The name of the custom rule.
	•	function: The validation function with the signature (field, value, param, validatorInstance).

Built-in Validation Methods

	•	required(field, value)
	•	string(field, value)
	•	number(field, value)
	•	boolean(field, value)
	•	array(field, value)
	•	object(field, value)
	•	minLength(field, value, length)
	•	maxLength(field, value, length)
	•	regex(field, value, pattern)

Each method performs a specific validation and adds an error message to the validator instance if the validation fails.

Testing

The package uses Jest for testing. To run the tests, use:
npm test

Example test case:
const Validator = require('../lib/validator');

describe('Validator Class', () => {
  test('should validate required fields', () => {
    const rules = { username: ['required'] };
    const data = {};
    const validator = new Validator(rules);
    const isValid = validator.validate(data);
    expect(isValid).toBe(false);
    expect(validator.getErrors()).toHaveProperty('username');
  });

  // More test cases...
});
Contributing

Contributions are welcome! Please follow these steps:

	1.	Fork the repository.
	2.	Create a new branch:
git checkout -b feature/your-feature-name
  3.	Make your changes and commit them:
git commit -m 'Add some feature'
 	4.	Push to the branch:
git push origin feature/your-feature-name

5.	Open a pull request.

Please ensure your code follows the project’s coding standards and includes appropriate tests.

Coding Guidelines

	•	Write clear, concise, and self-documenting code.
	•	Use consistent naming conventions.
	•	Include comments where necessary.
	•	Write unit tests for new features or bug fixes.

Reporting Issues

If you encounter any issues or bugs, please open an issue on GitHub with detailed information.

License

This project is licensed under the MIT License - see the LICENSE file for details.
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy...

Acknowledgments

	•	Inspired by the need for a simple yet powerful data validation solution in Node.js.
	•	Thanks to the open-source community for continuous support and contributions.

Feel free to copy this entire README.md into your GitHub repository. Make sure to:

	•	Replace placeholders like yourusername with your actual GitHub username.
	•	Update any links to point to your repository or relevant pages.
	•	Customize the content as needed, especially the License section and any personal acknowledgments.

Let me know if you need any more assistance!
```
