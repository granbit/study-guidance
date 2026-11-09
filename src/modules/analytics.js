class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class AnalyticsModule {
  async getStudentPerformanceReport(studentId, instructorId) {
    throw new NotImplementedError("AnalyticsModule.getStudentPerformanceReport not implemented");
  }

  async tuneReportLLMConfig(instructorId, promptConfig) {
    throw new NotImplementedError("AnalyticsModule.tuneReportLLMConfig not implemented");
  }
}

module.exports = { AnalyticsModule, NotImplementedError };