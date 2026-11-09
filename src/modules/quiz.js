class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class QuizModule {
  async getPracticeProblems(lessonId, studentId) {
    throw new NotImplementedError("QuizModule.getPracticeProblems not implemented");
  }

  async generateDynamicQuizQuestion(lessonId, studentId) {
    throw new NotImplementedError("QuizModule.generateDynamicQuizQuestion not implemented");
  }

  async submitAndGradeQuiz(quizId, studentId, answers) {
    throw new NotImplementedError("QuizModule.submitAndGradeQuiz not implemented");
  }

  async validateQuestionAgainstLesson(questionData, lessonId) {
    throw new NotImplementedError("QuizModule.validateQuestionAgainstLesson not implemented");
  }
}

module.exports = { QuizModule, NotImplementedError };