class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class InterfaceModule {
  async renderStaticPage(pageName, context = {}) {
    throw new NotImplementedError("InterfaceModule.renderStaticPage not implemented");
  }

  async handleChatbotInteraction(studentId, lessonId, userMessage) {
    throw new NotImplementedError("InterfaceModule.handleChatbotInteraction not implemented");
  }
}

module.exports = { InterfaceModule, NotImplementedError };