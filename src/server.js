const express = require('express');
const { AuthModule } = require('./modules/auth');
const { ContentModule } = require('./modules/content');
const { QuizModule } = require('./modules/quiz');
const { LLMGatewayModule } = require('./modules/llmGateway');
const { SafetyModule } = require('./modules/safety');
const { AnalyticsModule } = require('./modules/analytics');
const { InterfaceModule } = require('./modules/interface');

const app = express();
app.use(express.json());

const authModule = new AuthModule();
const contentModule = new ContentModule();
const quizModule = new QuizModule();
const llmGatewayModule = new LLMGatewayModule();
const safetyModule = new SafetyModule();
const analyticsModule = new AnalyticsModule();
const interfaceModule = new InterfaceModule();

const notImplementedHandler = (moduleMethodName) => async (req, res) => {
  res.status(501).json({
    error: "not_implemented",
    message: `Endpoint mapped to ${moduleMethodName} is not implemented.`
  });
};

// [NFR-SAFE-02] Auth Route
app.post('/api/auth/login', notImplementedHandler('AuthModule.authenticateUser'));

// [QUIZ-01], [QUIZ-02] Solve practice problems & problem types
app.get('/api/quizzes/problems', notImplementedHandler('QuizModule.getPracticeProblems'));

// [QUIZ-03] Generate dynamic practice problems via LLM
app.post('/api/quizzes/generate', notImplementedHandler('QuizModule.generateDynamicQuizQuestion'));

// [QUIZ-04] Graded quizzes upon completion
app.post('/api/quizzes/:quizId/submit', notImplementedHandler('QuizModule.submitAndGradeQuiz'));

// [LLM-01], [LLM-05] Chatbot interaction & feedback
app.post('/api/chat/message', notImplementedHandler('InterfaceModule.handleChatbotInteraction'));

// [LLM-02], [LLM-08] Multi-LLM Routing & Timeouts
app.post('/api/llm/route', notImplementedHandler('LLMGatewayModule.routeRequest'));

// [LLM-03], [CONTENT-01] Content creation & pre-written lesson plans
app.post('/api/lessons', notImplementedHandler('ContentModule.createLesson'));

// [LLM-04], [LLM-09], [NFR-SAFE-01] Moderation & Safety guardrails
app.post('/api/safety/moderate-input', notImplementedHandler('SafetyModule.moderateInput'));

// [LLM-06] Validate generated questions against lesson plan
app.post('/api/quizzes/validate-question', notImplementedHandler('QuizModule.validateQuestionAgainstLesson'));

// [LLM-07] Rate limiting for LLM requests
app.get('/api/llm/rate-limit', notImplementedHandler('LLMGatewayModule.checkRateLimit'));

// [INST-01] Student performance reports
app.get('/api/instructors/reports/:studentId', notImplementedHandler('AnalyticsModule.getStudentPerformanceReport'));

// [INST-02] Tune LLM performance report parameters
app.put('/api/instructors/llm-config', notImplementedHandler('AnalyticsModule.tuneReportLLMConfig'));

// [CONTENT-02] Teacher notes on lesson plans
app.post('/api/lessons/:lessonId/notes', notImplementedHandler('ContentModule.addTeacherNote'));

// [NFR-OPEN-01], [NFR-PERF-02] Offline file download sync
app.get('/api/content/offline-sync', notImplementedHandler('ContentModule.syncOfflineFiles'));

// [NFR-PERF-02] Static layout interface delivery
app.get('/', notImplementedHandler('InterfaceModule.renderStaticPage'));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Digital Learning Platform skeleton running on port ${PORT}`);
  });
}

module.exports = app;