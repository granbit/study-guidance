# Contracts

## 1. Module Functions & Classes

### Auth Module (`src/modules/auth.js`)
* **`AuthModule.authenticateUser(credentials)`**
  * **Signature:** `authenticateUser(credentials: { username?: string, password?: string, oauthToken?: string }): Promise<{ userId: string, role: string, token: string }>`
  * **Success Result:** Returns user identity, assigned role, and session auth token.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `InvalidCredentialsError`, `AuthenticationFailedError`).
  * **Spec Rule Served:** Configurable institutional login (OAuth, username/password), `[NFR-SAFE-02]`.
  * **Injected Dependencies:** Password hasher, User Repository, Identity Provider Client.

* **`AuthModule.verifyMFAOrPasskey(userId, verificationToken)`**
  * **Signature:** `verifyMFAOrPasskey(userId: string, verificationToken: string): Promise<boolean>`
  * **Success Result:** Returns `true` if MFA/Passkey verification succeeds.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `MFAValidationError`).
  * **Spec Rule Served:** Mandatory physical passkeys/MFA for admins/writers, `[NFR-SAFE-02]`.
  * **Injected Dependencies:** WebAuthn/Passkey Verifier, Clock.

* **`AuthModule.authorizeRole(userId, requiredRole)`**
  * **Signature:** `authorizeRole(userId: string, requiredRole: string): Promise<boolean>`
  * **Success Result:** Returns `true` if user possesses required role permissions.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `UnauthorizedError`).
  * **Spec Rule Served:** `[NFR-SAFE-02]`.
  * **Injected Dependencies:** RBAC Policy Store.

---

### Content Module (`src/modules/content.js`)
* **`ContentModule.createLesson(lessonData)`**
  * **Signature:** `createLesson(lessonData: { title: string, subjectId: string, contentWritten: string, graphicalAssets?: string[], audioAssets?: string[] }): Promise<{ lessonId: string }>`
  * **Success Result:** Creates and returns new lesson ID.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `ValidationError`).
  * **Spec Rule Served:** `[CONTENT-01]`, `[LLM-03]`, Domain Objects (Lessons, Content-Audio, Graphical, Written).
  * **Injected Dependencies:** Content Repository, Object Storage Client, Clock.

* **`ContentModule.addTeacherNote(lessonId, instructorId, noteContent)`**
  * **Signature:** `addTeacherNote(lessonId: string, instructorId: string, noteContent: string): Promise<{ noteId: string }>`
  * **Success Result:** Returns created note ID associated with the lesson.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `LessonNotFoundError`).
  * **Spec Rule Served:** `[CONTENT-02]`.
  * **Injected Dependencies:** Note Repository, Clock.

* **`ContentModule.getLesson(lessonId)`**
  * **Signature:** `getLesson(lessonId: string): Promise<object>`
  * **Success Result:** Returns detailed lesson plan data including teacher notes and media.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `LessonNotFoundError`).
  * **Spec Rule Served:** `[LLM-03]`, `[LLM-05]`, `[CONTENT-01]`, `[CONTENT-02]`.
  * **Injected Dependencies:** Content Repository, Note Repository.

* **`ContentModule.syncOfflineFiles(studentId)`**
  * **Signature:** `syncOfflineFiles(studentId: string): Promise<{ downloadableBundleUrl: string }>`
  * **Success Result:** Generates offline downloadable file bundle.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `SyncError`).
  * **Spec Rule Served:** Node.js static/offline download capabilities, `[NFR-PERF-02]`.
  * **Injected Dependencies:** File Storage System.

---

### Quiz Module (`src/modules/quiz.js`)
* **`QuizModule.getPracticeProblems(lessonId, studentId)`**
  * **Signature:** `getPracticeProblems(lessonId: string, studentId: string): Promise<Array<object>>`
  * **Success Result:** Returns list of practice problems (multiple choice, short answer, fill-in-blank).
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[QUIZ-01]`, `[QUIZ-02]`.
  * **Injected Dependencies:** Quiz Repository.

* **`QuizModule.generateDynamicQuizQuestion(lessonId, studentId)`**
  * **Signature:** `generateDynamicQuizQuestion(lessonId: string, studentId: string): Promise<object>`
  * **Success Result:** Returns LLM-generated practice problem validated against lesson content.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `ValidationFailedError`, `ExhaustedContentError`).
  * **Spec Rule Served:** `[QUIZ-03]`, `[LLM-06]`, Valid LLM Generate Quiz Question criteria.
  * **Injected Dependencies:** ContentModule, LLMGatewayModule, SafetyModule, Clock.

* **`QuizModule.submitAndGradeQuiz(quizId, studentId, answers)`**
  * **Signature:** `submitAndGradeQuiz(quizId: string, studentId: string, answers: Array<object>): Promise<{ score: number, breakdown: Array<object> }>`
  * **Success Result:** Immediately grades quiz and returns score and detailed breakdown.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[QUIZ-04]`.
  * **Injected Dependencies:** Quiz Repository, AnalyticsModule, Clock.

* **`QuizModule.validateQuestionAgainstLesson(questionData, lessonId)`**
  * **Signature:** `validateQuestionAgainstLesson(questionData: object, lessonId: string): Promise<boolean>`
  * **Success Result:** Returns `true` if generated question matches lesson factual baseline.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[LLM-06]`, Valid LLM Generate Quiz Question criteria.
  * **Injected Dependencies:** ContentModule.

---

### LLM Gateway Module (`src/modules/llmGateway.js`)
* **`LLMGatewayModule.routeRequest(prompt, options)`**
  * **Signature:** `routeRequest(prompt: string, options: { timeoutMs?: number, modelPreference?: string }): Promise<{ responseText: string, modelUsed: string }>`
  * **Success Result:** Returns LLM completion with system multi-LLM failover routing.
  * **How it Fails:** Throws `NotImplementedError` (in real implementation: `TimeoutException`, `AllProvidersFailedException`).
  * **Spec Rule Served:** `[LLM-02]`, `[LLM-08]`, `[NFR-PERF-01]`, Multi-LLM failover.
  * **Injected Dependencies:** Primary LLM API Client, Secondary/Failover LLM API Client, Clock.

* **`LLMGatewayModule.checkRateLimit(userId)`**
  * **Signature:** `checkRateLimit(userId: string): Promise<{ isAllowed: boolean, remaining: number }>`
  * **Success Result:** Returns rate limit status for student.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[LLM-07]`, Student Message Chatbox Acceptance criteria.
  * **Injected Dependencies:** Rate Limit Counter / Cache Store, Clock.

---

### Safety Module (`src/modules/safety.js`)
* **`SafetyModule.moderateInput(text)`**
  * **Signature:** `moderateInput(text: string): Promise<{ isSafe: boolean, flagReason?: string }>`
  * **Success Result:** Evaluates input text for abuse, violence, or profanity using regex/heuristics.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[LLM-09]`, `[NFR-SAFE-01]`, Student Message Chatbox Acceptance criteria.
  * **Injected Dependencies:** Heuristic/Regex Pattern Engine.

* **`SafetyModule.moderateOutput(text, currentTopic)`**
  * **Signature:** `moderateOutput(text: string, currentTopic: string): Promise<{ isSafe: boolean, isOnTopic: boolean }>`
  * **Success Result:** Evaluates output text for off-topic drift, hallucinations, or unsafe content.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[LLM-04]`, `[NFR-SAFE-01]`.
  * **Injected Dependencies:** Moderate Classifier / Heuristic Engine.

---

### Analytics Module (`src/modules/analytics.js`)
* **`AnalyticsModule.getStudentPerformanceReport(studentId, instructorId)`**
  * **Signature:** `getStudentPerformanceReport(studentId: string, instructorId: string): Promise<object>`
  * **Success Result:** Returns calculated performance analytics and LLM summary report.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[INST-01]`, `[NFR-SEC-01]`.
  * **Injected Dependencies:** Quiz Repository, Content Repository, LLMGatewayModule.

* **`AnalyticsModule.tuneReportLLMConfig(instructorId, promptConfig)`**
  * **Signature:** `tuneReportLLMConfig(instructorId: string, promptConfig: { subjectId: string, criteria: string }): Promise<{ success: boolean }>`
  * **Success Result:** Updates instructor-specific LLM parameters for report generation.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[INST-02]`.
  * **Injected Dependencies:** Configuration Store.

---

### Interface Module (`src/modules/interface.js`)
* **`InterfaceModule.renderStaticPage(pageName, context)`**
  * **Signature:** `renderStaticPage(pageName: string, context?: object): Promise<string>`
  * **Success Result:** Returns static layout HTML string optimized for low-power devices.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** Server-delivered static layouts, `[NFR-PERF-02]`.
  * **Injected Dependencies:** Static Template Engine.

* **`InterfaceModule.handleChatbotInteraction(studentId, lessonId, userMessage)`**
  * **Signature:** `handleChatbotInteraction(studentId: string, lessonId: string, userMessage: string): Promise<{ reply: string }>`
  * **Success Result:** Orchestrates input moderation, rate limits, LLM request execution, and output moderation.
  * **How it Fails:** Throws `NotImplementedError`.
  * **Spec Rule Served:** `[LLM-01]`, `[LLM-05]`, Student Chatbot Interaction Gherkin scenario.
  * **Injected Dependencies:** AuthModule, SafetyModule, LLMGatewayModule, ContentModule.

---

## 2. REST API Routes Mapping

| Requirement | HTTP Method | REST Route Path | Mapped Public Function |
| --- | --- | --- | --- |
| **[QUIZ-01]**, **[QUIZ-02]** | `GET` | `/api/quizzes/problems` | `QuizModule.getPracticeProblems` |
| **[QUIZ-03]** | `POST` | `/api/quizzes/generate` | `QuizModule.generateDynamicQuizQuestion` |
| **[QUIZ-04]** | `POST` | `/api/quizzes/:quizId/submit` | `QuizModule.submitAndGradeQuiz` |
| **[LLM-01]**, **[LLM-05]** | `POST` | `/api/chat/message` | `InterfaceModule.handleChatbotInteraction` |
| **[LLM-02]**, **[LLM-08]** | `POST` | `/api/llm/route` | `LLMGatewayModule.routeRequest` |
| **[LLM-03]**, **[CONTENT-01]**| `POST` | `/api/lessons` | `ContentModule.createLesson` |
| **[LLM-04]**, **[LLM-09]**, **[NFR-SAFE-01]** | `POST` | `/api/safety/moderate-input` | `SafetyModule.moderateInput` |
| **[LLM-06]** | `POST` | `/api/quizzes/validate-question` | `QuizModule.validateQuestionAgainstLesson` |
| **[LLM-07]** | `GET` | `/api/llm/rate-limit` | `LLMGatewayModule.checkRateLimit` |
| **[INST-01]** | `GET` | `/api/instructors/reports/:studentId` | `AnalyticsModule.getStudentPerformanceReport` |
| **[INST-02]** | `PUT` | `/api/instructors/llm-config` | `AnalyticsModule.tuneReportLLMConfig` |
| **[CONTENT-02]** | `POST` | `/api/lessons/:lessonId/notes` | `ContentModule.addTeacherNote` |
| **[NFR-OPEN-01]**, **[NFR-PERF-02]** | `GET` | `/api/content/offline-sync` | `ContentModule.syncOfflineFiles` |
| **[NFR-SAFE-02]** | `POST` | `/api/auth/login` | `AuthModule.authenticateUser` |

*Note: Every endpoint returns HTTP 501 with response `{"error": "not_implemented", "message": "..."}` until implemented.*