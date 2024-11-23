// backend/config/security.js
const crypto = require('crypto');

class SecurityService {
  // Generate a secure random transaction PIN
  static generateTransactionPin(length = 6) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  // Hash sensitive information
  static hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Validate transaction PIN
  static validateTransactionPin(inputPin, storedPin) {
    return this.hashData(inputPin) === storedPin;
  }

  // Generate secure random security key for admin
  static generateSecurityKey(length = 16) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Encrypt sensitive data
  static encrypt(text, secretKey) {
    const cipher = crypto.createCipheriv('aes-256-cbc', 
      crypto.scryptSync(secretKey, 'salt', 32), 
      Buffer.alloc(16, 0)
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Decrypt sensitive data
  static decrypt(encryptedText, secretKey) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', 
      crypto.scryptSync(secretKey, 'salt', 32), 
      Buffer.alloc(16, 0)
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = SecurityService;
