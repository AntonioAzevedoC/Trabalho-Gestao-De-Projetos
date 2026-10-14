// File with helper functions to validate data before sending it to backend
const { modules: regex } = require("./regex");

// Importing user roles
const PERMISSIONS_LIST = require("../config/rolesPermissionsList");

// Function to validate emails
const validateEmail = (email) => {
  return regex.reEmail.test(email);
};

// Function to validate dates
const validateDate = (v) => {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return false;
  }

  const date = new Date(`${v}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === v;
};

// Function to validate name
const validateName = (userName) => {
  return regex.reName.test(userName);
};

// Function to validate role
const validateRole = (role) => {
  return true;
};

// Function to leave only numbers in functions
const trimStringNumber = (str) => {
  return str.replace(/\D/g, ""); // Returns string with only numbers
};

// Function to test CPF
const validateCPF = (cpf) => {
  // Trimming CPF (Just to be sure)
  cpf = trimStringNumber(cpf);

  // If CPF regex is valid, try to validate the CPF
  if (regex.reCPF.test(cpf)) {
    // Separating CPF
    let cpfNumbers = cpf.slice(0, 9);
    const firstDigit = Number(cpf.charAt(9));
    const secondDigit = Number(cpf.charAt(10));

    // Validating first digit
    let fstDigitValidation = 0;
    for (let i = 0; i < 9; i++) {
      fstDigitValidation += cpfNumbers[i] * (10 - i);
    }
    fstDigitValidation = (fstDigitValidation * 10) % 11;

    // If first digit is invalid, return false
    if (fstDigitValidation !== firstDigit) {
      return false;
    }

    // Validating second digit
    let scdDigitValidation = 0;
    cpfNumbers += firstDigit;
    for (let i = 0; i < 10; i++) {
      scdDigitValidation += cpfNumbers[i] * (11 - i);
    }
    scdDigitValidation = (scdDigitValidation * 10) % 11;

    // If second digit is invalid, return false
    if (scdDigitValidation !== secondDigit) {
      return false;
    }

    // If everything is correct
    return true;
  } else {
    return false;
  }
};

// Function to test phone number
const validatePhone = (phone) => {
  // Trimming phone (Just to be sure)
  phone = trimStringNumber(phone);

  return regex.rePhone.test(phone);
};

// Function to validate password
const validatePassword = (passwd) => {
  return regex.rePasswd.test(passwd);
};

// Exporting functions
module.exports = {
  validateEmail,
  validateDate,
  validateName,
  validateRole,
  trimStringNumber,
  validateCPF,
  validatePassword,
};
