class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class ContentModule {
  async createLesson(lessonData) {
    throw new NotImplementedError("ContentModule.createLesson not implemented");
  }

  async addTeacherNote(lessonId, instructorId, noteContent) {
    throw new NotImplementedError("ContentModule.addTeacherNote not implemented");
  }

  async getLesson(lessonId) {
    throw new NotImplementedError("ContentModule.getLesson not implemented");
  }

  async syncOfflineFiles(studentId) {
    throw new NotImplementedError("ContentModule.syncOfflineFiles not implemented");
  }
}

module.exports = { ContentModule, NotImplementedError };