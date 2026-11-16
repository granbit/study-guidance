const express = require('express');
const { AuthModule, InvalidCredentialsError, AuthenticationFailedError } = require('./modules/auth');
const { ContentModule, ValidationError: ContentValidationError, LessonNotFoundError } = require('./modules/content');
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
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, oauthToken } = req.body || {};
    const result = await authModule.authenticateUser({ username, password, oauthToken });
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof AuthenticationFailedError) {
      return res.status(401).json({
        error: 'invalid_credentials',
        message: err.message
      });
    }
    res.status(500).json({ error: 'internal_server_error', message: err.message });
  }
});

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
app.post('/api/lessons', async (req, res) => {
  try {
    const result = await contentModule.createLesson(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof ContentValidationError) {
      return res.status(400).json({
        error: 'validation_error',
        message: err.message
      });
    }
    res.status(500).json({ error: 'internal_server_error', message: err.message });
  }
});

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
app.post('/api/lessons/:lessonId/notes', async (req, res) => {
  try {
    const { instructorId, noteContent } = req.body || {};
    const result = await contentModule.addTeacherNote(req.params.lessonId, instructorId, noteContent);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof LessonNotFoundError) {
      return res.status(404).json({
        error: 'lesson_not_found',
        message: err.message
      });
    }
    if (err instanceof ContentValidationError) {
      return res.status(400).json({
        error: 'validation_error',
        message: err.message
      });
    }
    res.status(500).json({ error: 'internal_server_error', message: err.message });
  }
});

// [NFR-OPEN-01], [NFR-PERF-02] Offline file download sync
app.get('/api/content/offline-sync', notImplementedHandler('ContentModule.syncOfflineFiles'));

// [NFR-PERF-02] Static layout interface delivery
app.get('/', async (req, res) => {
  try {
    const html = await interfaceModule.renderStaticPage('index');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).json({ error: "internal_server_error", message: err.message });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Digital Learning Platform skeleton running on port ${PORT}`);
  });
}

module.exports = app;