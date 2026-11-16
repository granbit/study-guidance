class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class InterfaceModule {
  async renderStaticPage(pageName = 'index', context = {}) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Digital Learning Platform</title>
  <style>
    body { font-family: sans-serif; margin: 0; padding: 1rem; color: #333; }
    header { border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; margin-bottom: 1rem; }
    main { max-width: 800px; margin: 0 auto; }
  </style>
</head>
<body>
  <header>
    <h1>Digital Learning and Teaching System</h1>
  </header>
  <main>
    <h2>Welcome to your Study Guidance</h2>
    <p>Access lessons, practice quizzes, and interactive study tools.</p>
  </main>
</body>
</html>`;
  }

  async handleChatbotInteraction(studentId, lessonId, userMessage) {
    throw new NotImplementedError("InterfaceModule.handleChatbotInteraction not implemented");
  }
}

module.exports = { InterfaceModule, NotImplementedError };