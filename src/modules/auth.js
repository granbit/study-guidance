class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class AuthModule {
  async authenticateUser(credentials) {
    throw new NotImplementedError("AuthModule.authenticateUser not implemented");
  }

  async verifyMFAOrPasskey(userId, verificationToken) {
    throw new NotImplementedError("AuthModule.verifyMFAOrPasskey not implemented");
  }

  async authorizeRole(userId, requiredRole) {
    throw new NotImplementedError("AuthModule.authorizeRole not implemented");
  }
}

module.exports = { AuthModule, NotImplementedError };