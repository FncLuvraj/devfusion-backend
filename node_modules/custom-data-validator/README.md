# Custom Data Validator

[![npm version](https://img.shields.io/npm/v/custom-data-validator.svg)](https://www.npmjs.com/package/custom-data-validator)
[![license](https://img.shields.io/npm/l/custom-data-validator.svg)](https://github.com/yourusername/custom-data-validator/blob/main/LICENSE)
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
- **Built-in Validation Rules**: Common validations like required fields, data types, length constraints, and pattern matching. -**Auto-Trim and Case Normalization**: Automatically trim whitespace and normalize case for string inputs.
- **Custom Validation Support**: Easily add your own validation functions.
- **Detailed Error Messages**: Provides clear and customizable error messages.
- **Chainable Rules**: Apply multiple validation rules to a single field.
- **Field-wise Validation**: Validates each field independently for precise error reporting.

## Installation

# Install the package via npm:

npm install custom-data-validator

## Quick Start

# Here's a simple example to get you started:

```javascript
const { Validator } = require(‘custom-data-validator’);

const rules = {
username: [‘required’, ‘string’, ‘minLength:3’, ‘maxLength:15’],
email: [‘required’, ‘string’, ‘validateEmail’],
age: [‘number’],
isAdmin: [‘boolean’],
};

const data = {
username: ’ john_doe ’,
email: ’ John.Doe@Example.com ’,
age: 28,
isAdmin: false,
};

const validator = new Validator(rules);
const isValid = validator.validate(data);

if (isValid) {
console.log(‘Validation passed!’);
} else {
console.log(‘Validation errors:’, validator.getErrors());
}
```

## Usage

# Defining Validation Rules

Validation rules are defined as an object where each key corresponds to a field in your data, and the value is an array of validation rules to apply to that field.

const rules = {
fieldName: ['rule1', 'rule2:param', 'customRule'],
};


-**fieldName**: The name of the field in your data object.
**rule1, rule2**
: Validation rules to apply to the field.

## Available Validation Rules

- **required**: The field must be present and not empty.
- **string**: The field must be a string.
- **number**: The field must be a number.
- **boolean**: The field must be a boolean.
- **array**: The field must be an array.
- **object**: The field must be an object.
- **minLength**
: The string or array must be at least X characters/items long.
- **maxLength**
: The string or array must be no more than X characters/items long.
- **regex**
: The string must match the provided regular expression pattern.
validateEmail: The field must be a valid email address.

## Auto-Trim and Case Normalization

This feature ensures that user inputs are automatically trimmed of extra spaces and, optionally, case-normalized (e.g., making emails all lowercase). It significantly improves data consistency and reduces common user input issues, especially in forms.

# Available Validation Rules


# Why It's Impactful:


- **Improves Data Quality**: Prevents common errors like leading/trailing spaces in usernames, emails, or other fields that could cause validation issues.
- **User-Friendly**: Avoids user frustration with inputs being rejected for small formatting issues.
- **Simple to Implement**: It only takes a few lines of code to add trimming and normalization before validation begins.


**Improves Data Quality**: Prevents common errors like leading/trailing spaces in usernames, emails, or other fields that could cause validation issues.
**User-Friendly**: Avoids user frustration with inputs being rejected for small formatting issues.
**Simple to Implement**: It only takes a few lines of code to add trimming and normalization before validation begins.

**Auto-Trim: Remove leading and trailing spaces from all string inputs.
**Email Normalization\*\*: Automatically convert email inputs to lowercase to avoid case-sensitivity issues.

## Usage:

By default, you should manually trim and normalize your inputs before validation to ensure data consistency.
```javascript
const { Validator, normalizeEmail } = require('custom-data-validator');

const data = {
username: ' JohnDoe ',
email: ' John.Doe@Example.com ',
};

// Auto-trim string inputs
data.username = data.username.trim();

// Normalize email before validation
data.email = normalizeEmail(data.email);

const rules = {
username: ['required', 'string', 'minLength:3'],
email: ['required', 'validateEmail'],
};

const validator = new Validator(rules);
const isValid = validator.validate(data); 
```

## Custom Validators

# Custom Validators



You can add your own custom validation functions to extend the validator’s capabilities.
```javascript
validator.addCustomValidator('isEven', (field, value, param, validatorInstance) => {
if (value % 2 !== 0) {
validatorInstance.addError(field, `${field} must be an even number.`);
}
});

const rules = {
code: ['required', 'number', 'isEven'],
};

const data = { code: 3 };

validator.rules = rules;
const isValid = validator.validate(data);

if (!isValid) {
console.log(validator.getErrors());
}
```

# Error Handling


The validator collects errors for each field during validation. Use validator.getErrors() to retrieve the errors.
```javascript
if (!isValid) {
const errors = validator.getErrors();
console.log(errors);
// Output:
// {
// code: ['code must be an even number.']
// }
}
```


# Examples

## Examples

## Basic Usage
```javascript
const { Validator, normalizeEmail } = require('custom-data-validator');

const rules = {
name: ['required', 'string', 'minLength:2'],
email: ['required', 'validateEmail'],
password: ['required', 'string', 'minLength:6'],
age: ['number'],
termsAccepted: ['required', 'boolean'],
};

const data = {
name: ' Alice ',
email: ' alice@example.com ',
password: 'secret123',
age: 30,
termsAccepted: true,
};

// Auto-trim and normalize inputs
data.name = data.name.trim();
data.email = normalizeEmail(data.email);

const validator = new Validator(rules);
const isValid = validator.validate(data);

if (isValid) {
console.log('All data is valid!');
} else {
console.error('Validation errors:', validator.getErrors());
}

```
## Custom Validation Function
```javascript


## Custom Validation Function

# Custom Validation Function



// Custom validator to check if a number is positive
validator.addCustomValidator('isPositive', (field, value, param, validatorInstance) => {
if (value <= 0) {
validatorInstance.addError(field, `${field} must be a positive number.`);
}
});

const rules = {
amount: ['required', 'number', 'isPositive'],
};

const data = { amount: -5 };

validator.rules = rules;
const isValid = validator.validate(data);

if (!isValid) {
console.log(validator.getErrors());
// Output:
// {
// amount: ['amount must be a positive number.']
// }
}
```


## API Reference

# Validator Class

The Validator class is the core of the Custom Data Validator package. It allows you to define validation rules for your data and provides methods to perform validations and handle errors.


# Constructor
```javascript


# API Reference

# Validator Class

# Constructor


const validator = new Validator(rules);
```

**rules**: An object defining validation rules for each field in your data. Each rule is an array of validation methods or custom validation functions.

```javascript
const rules = {
  username: ['required', 'string', 'minLength:3', 'maxLength:15'],
  email: ['required', 'validateEmail'],
};
const validator = new Validator(rules);
```
# Methods

**1. validate(data)**
This method runs the validation on the provided data object based on the defined rules.

data: An object where the keys are field names and values are the data to be validated.
**Returns**: true if validation passes, false otherwise.
```javascript
const data = { username: 'JohnDoe', email: 'john@example.com' };
const isValid = validator.validate(data);
```

**2. getErrors()**
Retrieves the error messages collected during validation. The returned object contains field names as keys and arrays of error messages as values.

**Returns**: An object with field names as keys and error messages as values.

Example:

```javascript
if (!isValid) {
  const errors = validator.getErrors();
  console.log(errors);
  // Output: { username: ['username must be at least 3 characters'], email: ['email is not valid'] }
}```

**3. addCustomValidator(name, validationFunction) **

Adds a custom validation function to extend the built-in validators.

**name**: The name of the custom rule.
**validationFunction**: A function with the signature (field, value, param, validatorInstance) that performs the validation.

Example:

```javascript
validator.addCustomValidator('isEven', (field, value, param, validatorInstance) => {
  if (value % 2 !== 0) {
    validatorInstance.addError(field, `${field} must be an even number.`);
  }
});

const rules = { number: ['required', 'isEven'] };
```

**4.addError(field, message)**

Manually adds an error message for a specific field. Useful for custom validators.

**field**: The field name.
**message**: The error message to add.

Example:
```javascript
validator.addError('username', 'Username cannot contain special characters.');
```

**5. resetErrors()**

Clears all errors from the validator. Useful if you need to validate multiple sets of data.

Example:
```javascript
validator.resetErrors();
```

**Built-in Validation Methods**

- **required(field, value)**: Ensures that the field is present and not empty.
- **string(field, value)**: Validates that the value is a string.
- **number(field, value)**: Ensures the value is a number.
- **boolean(field, value)**: Validates that the value is a boolean.
- **array(field, value)**: Ensures the value is an array.
- **object(field, value)**: Validates that the value is an object.
- **minLength(field, value, length)**: Ensures the string or array is at least length characters/items long.
- **maxLength(field, value, length)**: Ensures the string or array is no more than length characters/items long.
- **regex(field, value, pattern)**: Ensures the string matches the provided regular expression pattern.
- **validateEmail(field, value)**: Validates that the value is a correctly formatted email address.
Each of these methods is automatically applied when a rule is defined in the validation rules object.


## Custom Validation Functions

You can define custom validation functions if you need to implement specific logic that is not covered by the built-in validators.

Example of a custom validator:
```javascript
validator.addCustomValidator('isOdd', (field, value, param, validatorInstance) => {
  if (value % 2 === 0) {
    validatorInstance.addError(field, `${field} must be an odd number.`);
  }
});

const rules = {
  number: ['required', 'number', 'isOdd'],
};

const data = { number: 4 };

const isValid = validator.validate(data);
if (!isValid) {
  console.log(validator.getErrors());
  // Output: { number: ['number must be an odd number.'] }
}
```

# Error Handling

Errors are automatically collected during validation and can be accessed using the getErrors() method.

Example of handling validation errors:

```javascript
const isValid = validator.validate(data);

if (!isValid) {
  const errors = validator.getErrors();
  console.error('Validation Errors:', errors);
}
```
Errors are stored as an object where the keys are the field names, and the values are arrays of error messages. This allows for detailed and precise error reporting.

# Methods

- **validate(data)**: Validates the provided data against the rules.
- **data**: The data object to validate.
- **Returns**: true if validation passes, false otherwise.
- **getErrors()**: Retrieves the errors collected during validation.
- **Returns**: An object where keys are field names and values are arrays of error messages.
- **addCustomValidator(name, function)**: Adds a custom validation function.
- **Name**: The name of the custom rule.
- **function**: The validation function with the signature (field, value, param, validatorInstance).


## Built-in Validation Methods


- **required(field, value)**
- **string(field, value)**
- **number(field, value)**
- **boolean(field, value)**
- **array(field, value)**
- **object(field, value)**
- **minLength(field, value, length)**
- **maxLength(field, value, length)**
- **regex(field, value, pattern)**
- **validateEmail(field, value)**


**required(field, value)**
**string(field, value)**
**number(field, value)**
**boolean(field, value)**
**array(field, value)**
**object(field, value)**
**minLength(field, value, length)**
**maxLength(field, value, length)**
**regex(field, value, pattern)**
**validateEmail(field, value)**

Each method performs a specific validation and adds an error message to the validator instance if the validation fails.

## Testing

The package uses Jest for testing. To run the tests, use:

npm test

## License

This project is licensed under the MIT License - see the LICENSE file for details.
MIT License

# Testing

The package uses Jest for testing. To run the tests, use:
npm test

# Contributing

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

# Coding Guidelines

	•	Write clear, concise, and self-documenting code.
	•	Use consistent naming conventions.
	•	Include comments where necessary.
	•	Write unit tests for new features or bug fixes.

# Reporting Issues

If you encounter any issues or bugs, please open an issue on GitHub with detailed information.

# License

This project is licensed under the MIT License - see the LICENSE file for details.
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy...

# Acknowledgments

    •	Inspired by the need for a simple yet powerful data validation solution in Node.js.
    •	Thanks to the open-source community for continuous support and contributions.
```

```
