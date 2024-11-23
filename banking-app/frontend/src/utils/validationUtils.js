// src/utils/validationUtils.js
class ValidationUtils {
  // Email validation
  static validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  // Password strength validation
  static validatePassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  }

  // Phone number validation
  static validatePhoneNumber(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
  }

  // National ID validation (assuming 10 digit ID)
  static validateNationalId(id) {
    return /^\d{10}$/.test(id);
  }

  // Transaction PIN validation
  static validateTransactionPin(pin) {
    return /^\d{6}$/.test(pin);
  }

  // Perform form validation
  static validateRegistrationForm(formData) {
    const errors = {};

    if (!formData.fullName || formData.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    if (!this.validateEmail(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!this.validatePassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!this.validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number';
    }

    if (!this.validateNationalId(formData.nationalId)) {
      errors.nationalId = 'Invalid national ID';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default ValidationUtils;
