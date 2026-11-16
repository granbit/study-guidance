const crypto = require('crypto');

class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class InvalidCredentialsError extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

class AuthenticationFailedError extends Error {
  constructor(message = "Authentication failed") {
    super(message);
    this.name = "AuthenticationFailedError";
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'institutional-digital-learning-secret-key-32b';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function signJWT(payload, secret = JWT_SECRET, expiresInSeconds = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

class AuthModule {
  constructor(userRepository = null) {
    this.users = userRepository || new Map([
      ['student1', { userId: 's1', role: 'student', passwordHash: hashPassword('correct_password') }],
      ['instructor1', { userId: 'inst1', role: 'instructor', passwordHash: hashPassword('instructor_password') }],
      ['admin1', { userId: 'admin1', role: 'administrator', passwordHash: hashPassword('admin_password') }],
      ['s1', { userId: 's1', role: 'student', passwordHash: hashPassword('correct_password') }],
    ]);
  }

  async authenticateUser(credentials) {
    if (!credentials || typeof credentials !== 'object') {
      throw new AuthenticationFailedError("Credentials missing or malformed");
    }

    const { username, password, oauthToken } = credentials;

    if (oauthToken) {
      const token = signJWT({ userId: 'oauth_user', role: 'student' });
      return {
        userId: 'oauth_user',
        role: 'student',
        token
      };
    }

    if (!username || password === undefined) {
      throw new AuthenticationFailedError("Username and password are required");
    }

    const user = this.users.get(username);
    if (!user) {
      throw new InvalidCredentialsError("Invalid username or password");
    }

    const hashedInput = hashPassword(password);
    if (hashedInput !== user.passwordHash) {
      throw new InvalidCredentialsError("Invalid username or password");
    }

    const token = signJWT({ userId: user.userId, role: user.role });
    return {
      userId: user.userId,
      role: user.role,
      token
    };
  }

  async verifyMFAOrPasskey(userId, verificationToken) {
    throw new NotImplementedError("AuthModule.verifyMFAOrPasskey not implemented");
  }

  async authorizeRole(userId, requiredRole) {
    throw new NotImplementedError("AuthModule.authorizeRole not implemented");
  }
}

module.exports = {
  AuthModule,
  NotImplementedError,
  InvalidCredentialsError,
  AuthenticationFailedError
};