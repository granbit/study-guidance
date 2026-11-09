class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class LLMGatewayModule {
  async routeRequest(prompt, options = {}) {
    throw new NotImplementedError("LLMGatewayModule.routeRequest not implemented");
  }

  async checkRateLimit(userId) {
    throw new NotImplementedError("LLMGatewayModule.checkRateLimit not implemented");
  }
}

module.exports = { LLMGatewayModule, NotImplementedError };