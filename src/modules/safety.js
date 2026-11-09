class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class SafetyModule {
  async moderateInput(text) {
    throw new NotImplementedError("SafetyModule.moderateInput not implemented");
  }

  async moderateOutput(text, currentTopic) {
    throw new NotImplementedError("SafetyModule.moderateOutput not implemented");
  }
}

module.exports = { SafetyModule, NotImplementedError };