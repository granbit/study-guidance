# Implementation Plan: Digital Learning and Teaching System

## 1. Test Suite Baseline Output & Grouping

The test suite was executed against the initial skeleton (`npm test` / Jest), resulting in **20 failed tests out of 20 total tests**.

```
FAIL tests/acceptance.test.js
  Acceptance Criteria Tests
    GHERKIN-01: Student Chatbot Interaction
      × test_GHERKIN01: outside payload limit rejection and control
    CHATBOX-01: Student Message Chatbox Acceptance: Does not have profane or violent speech
      × test_CHATBOX01: rejection for profane/violent input and control
    CHATBOX-02: Student Message Chatbox Acceptance: Is on topic of current subject
      × test_CHATBOX02: rejection for off-topic question and control
    CHATBOX-03: Student Message Chatbox Acceptance: Student is not over ratelimit for messages
      × test_CHATBOX03: rejection when exceeding rate limit and control
    QUIZVAL-01: Valid LLM Generate Quiz Question: Information towards answers can be retrieved from lesson content
      × test_QUIZVAL01: rejection for out-of-lesson factual claims and control
    QUIZVAL-02: Valid LLM Generate Quiz Question: Has valid answer(s)
      × test_QUIZVAL02: rejection when lacking valid answer key and control
    QUIZVAL-03: Valid LLM Generate Quiz Question: Stylized like other questions in quizes
      × test_QUIZVAL03: rejection for divergent styling and control
    QUIZ-01-AC: [QUIZ-01] Solve practice problems to study
      × test_QUIZ01_AC: rejection for excessive page size and control
    QUIZ-02-AC: [QUIZ-02] Support multiple-choice, short-answer, and fill-in-blank problem types
      × test_QUIZ02_AC: rejection for unknown question type and control
    QUIZ-04-AC: [QUIZ-04] Immediate grading upon finish to identify mistakes
      × test_QUIZ04_AC: rejection for empty submission and control
    LLM-02-AC: [LLM-02] LLM access for student feedback and dynamic question generation
      × test_LLM02_AC: dynamic generation on exhausted topic and control
    LLM-03-AC: [LLM-03] Pre-written lesson plans as a baseline for LLMs created by authors
      × test_LLM03_AC: rejection for excessive lesson content length and control
    LLM-08-AC: [LLM-08] LLM request timeout to prevent infinite loops
      × test_LLM08_AC: timeout rejection and fast control response
    INST-01-AC: [INST-01] Student performance reports for targeted instruction
      × test_INST01_AC: rejection for invalid reporting window and control
    INST-02-AC: [INST-02] Tune LLM generation parameters for performance reports by subject
      × test_INST02_AC: rejection for empty criteria and control
    CONTENT-01-AC: [CONTENT-01] Rich editor supporting text styles, charts, images, video, and code
      × test_CONTENT01_AC: rejection for unauthorized executable payload and control
    CONTENT-02-AC: [CONTENT-02] Teacher custom notes attached to pre-written plans
      × test_CONTENT02_AC: rejection for non-existent lesson and control
    NFR-SEC-01-AC: [NFR-SEC-01] Encryption of chat logs, student records, and metrics in transit and at rest
      × test_NFR_SEC01_AC: rejection for unencrypted plain HTTP transport and control
    NFR-PERF-02-AC: [NFR-PERF-02] Optimization for mobile and low-powered devices
      × test_NFR_PERF02_AC: static layout asset delivery and size check
    AUTH-01: [AUTH-01] User authentication via institutional credentials and signed JSON Web Tokens
      × test_AUTH01: rejection for invalid credentials and control

Test Suites: 1 failed, 1 total
Tests:       20 failed, 20 total
```

### Failing Tests Grouped by Acceptance Criterion ID

1. **GHERKIN-01**: `test_GHERKIN01: outside payload limit rejection and control`
2. **CHATBOX-01**: `test_CHATBOX01: rejection for profane/violent input and control`
3. **CHATBOX-02**: `test_CHATBOX02: rejection for off-topic question and control`
4. **CHATBOX-03**: `test_CHATBOX03: rejection when exceeding rate limit and control`
5. **QUIZVAL-01**: `test_QUIZVAL01: rejection for out-of-lesson factual claims and control`
6. **QUIZVAL-02**: `test_QUIZVAL02: rejection when lacking valid answer key and control`
7. **QUIZVAL-03**: `test_QUIZVAL03: rejection for divergent styling and control`
8. **QUIZ-01-AC**: `test_QUIZ01_AC: rejection for excessive page size and control`
9. **QUIZ-02-AC**: `test_QUIZ02_AC: rejection for unknown question type and control`
10. **QUIZ-04-AC**: `test_QUIZ04_AC: rejection for empty submission and control`
11. **LLM-02-AC**: `test_LLM02_AC: dynamic generation on exhausted topic and control`
12. **LLM-03-AC**: `test_LLM03_AC: rejection for excessive lesson content length and control`
13. **LLM-08-AC**: `test_LLM08_AC: timeout rejection and fast control response`
14. **INST-01-AC**: `test_INST01_AC: rejection for invalid reporting window and control`
15. **INST-02-AC**: `test_INST02_AC: rejection for empty criteria and control`
16. **CONTENT-01-AC**: `test_CONTENT01_AC: rejection for unauthorized executable payload and control`
17. **CONTENT-02-AC**: `test_CONTENT02_AC: rejection for non-existent lesson and control`
18. **NFR-SEC-01-AC**: `test_NFR_SEC01_AC: rejection for unencrypted plain HTTP transport and control`
19. **NFR-PERF-02-AC**: `test_NFR_PERF02_AC: static layout asset delivery and size check`
20. **AUTH-01**: `test_AUTH01: rejection for invalid credentials and control`

---

## 2. Implementation Slices

### Slice 1: Static Layout Delivery (Thin End-to-End Walking Skeleton)
- **Name**: Static Layout Delivery
- **Goal**: Deliver a lightweight server-rendered HTML layout string optimized for low-powered and mobile devices.
- **Spec sources**: Section Functional Requirements; Section Non-Functional Requirements `[NFR-PERF-02]`.
- **Criteria**: `NFR-PERF-02-AC`
- **Tests that should turn green**: `test_NFR_PERF02_AC: static layout asset delivery and size check`
- **Skeleton to fill in**: `InterfaceModule.renderStaticPage(pageName, context)` in `src/modules/interface.js` and route `GET /` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_NFR_PERF02_AC: static layout asset delivery and size check` passes and no previously passing test fails.
- **Status**: completed.

### Slice 2: User Authentication & JWT Issuance
- **Name**: User Authentication & JWT Issuance
- **Goal**: Authenticate institutional credentials and issue signed JWT tokens for valid sessions while rejecting invalid credentials with HTTP 401.
- **Spec sources**: Section Functional Requirements `[AUTH-01]`; Section Non-Functional Requirements `[NFR-SAFE-02]`.
- **Criteria**: `AUTH-01`
- **Tests that should turn green**: `test_AUTH01: rejection for invalid credentials and control`
- **Skeleton to fill in**: `AuthModule.authenticateUser(credentials)` in `src/modules/auth.js` and route `POST /api/auth/login` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_AUTH01: rejection for invalid credentials and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 3: Lesson Plan Content Creation
- **Name**: Lesson Plan Content Creation
- **Goal**: Store lesson plans containing written content and media references while rejecting malicious or executable file payloads.
- **Spec sources**: Section Functional Requirements `[CONTENT-01]`, `[LLM-03]`; Domain Model Objects (Lessons, Content-Written, Graphical, Audio).
- **Criteria**: `CONTENT-01-AC`
- **Tests that should turn green**: `test_CONTENT01_AC: rejection for unauthorized executable payload and control`
- **Skeleton to fill in**: `ContentModule.createLesson(lessonData)` in `src/modules/content.js` and route `POST /api/lessons` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_CONTENT01_AC: rejection for unauthorized executable payload and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 4: Lesson Plan Storage Boundary Validation
- **Name**: Lesson Plan Storage Boundary Validation
- **Goal**: Enforce maximum storage length limits on lesson written content, rejecting oversized payloads with HTTP 400.
- **Spec sources**: Section Functional Requirements `[LLM-03]`.
- **Criteria**: `LLM-03-AC`
- **Tests that should turn green**: `test_LLM03_AC: rejection for excessive lesson content length and control`
- **Skeleton to fill in**: `ContentModule.createLesson(lessonData)` in `src/modules/content.js` and route `POST /api/lessons` in `src/server.js`.
- **Depends on**: Slice 3.
- **Done when**: `test_LLM03_AC: rejection for excessive lesson content length and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 5: Teacher Custom Notes Attachment
- **Name**: Teacher Custom Notes Attachment
- **Goal**: Attach teacher notes to existing lesson plans and return HTTP 404 when the target lesson ID does not exist.
- **Spec sources**: Section Functional Requirements `[CONTENT-02]`.
- **Criteria**: `CONTENT-02-AC`
- **Tests that should turn green**: `test_CONTENT02_AC: rejection for non-existent lesson and control`
- **Skeleton to fill in**: `ContentModule.addTeacherNote(lessonId, instructorId, noteContent)` in `src/modules/content.js` and route `POST /api/lessons/:lessonId/notes` in `src/server.js`.
- **Depends on**: Slice 3.
- **Done when**: `test_CONTENT02_AC: rejection for non-existent lesson and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 6: Chat Input Safety Moderation
- **Name**: Chat Input Safety Moderation
- **Goal**: Screen user messages for profanity or violent threats via lightweight heuristics and return safety violation flags.
- **Spec sources**: Section Functional Requirements `[LLM-09]`; Section Non-Functional Requirements `[NFR-SAFE-01]`; Acceptance Criteria (Student Message Chatbox Acceptance 1).
- **Criteria**: `CHATBOX-01`
- **Tests that should turn green**: `test_CHATBOX01: rejection for profane/violent input and control`
- **Skeleton to fill in**: `SafetyModule.moderateInput(text)` in `src/modules/safety.js` and route `POST /api/safety/moderate-input` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_CHATBOX01: rejection for profane/violent input and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 7: LLM Rate Limiting
- **Name**: LLM Rate Limiting
- **Goal**: Track student request counters and reject callers exceeding their message window with HTTP 429 Too Many Requests.
- **Spec sources**: Section Functional Requirements `[LLM-07]`; Acceptance Criteria (Student Message Chatbox Acceptance 3).
- **Criteria**: `CHATBOX-03`
- **Tests that should turn green**: `test_CHATBOX03: rejection when exceeding rate limit and control`
- **Skeleton to fill in**: `LLMGatewayModule.checkRateLimit(userId)` in `src/modules/llmGateway.js` and route `GET /api/llm/rate-limit` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_CHATBOX03: rejection when exceeding rate limit and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 8: LLM Request Routing with Timeout
- **Name**: LLM Request Routing with Timeout
- **Goal**: Dispatch prompts to the primary LLM provider with strict timeout enforcement, returning HTTP 504 on timeouts.
- **Spec sources**: Section Functional Requirements `[LLM-02]`, `[LLM-08]`; Section Non-Functional Requirements `[NFR-PERF-01]`.
- **Criteria**: `LLM-08-AC`
- **Tests that should turn green**: `test_LLM08_AC: timeout rejection and fast control response`
- **Skeleton to fill in**: `LLMGatewayModule.routeRequest(prompt, options)` in `src/modules/llmGateway.js` and route `POST /api/llm/route` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_LLM08_AC: timeout rejection and fast control response` passes and no previously passing test fails.
- **Status**: not started.

### Slice 9: Chat Channel Transport Encryption Guard
- **Name**: Chat Channel Transport Encryption Guard
- **Goal**: Enforce transport layer encryption on chat endpoints by rejecting unencrypted HTTP traffic (`x-forwarded-proto: http`) with HTTP 403.
- **Spec sources**: Section Non-Functional Requirements `[NFR-SEC-01]`.
- **Criteria**: `NFR-SEC-01-AC`
- **Tests that should turn green**: `test_NFR_SEC01_AC: rejection for unencrypted plain HTTP transport and control`
- **Skeleton to fill in**: `InterfaceModule.handleChatbotInteraction(studentId, lessonId, userMessage)` in `src/modules/interface.js` and route `POST /api/chat/message` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_NFR_SEC01_AC: rejection for unencrypted plain HTTP transport and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 10: Student Chatbot Interaction Pipeline
- **Name**: Student Chatbot Interaction Pipeline
- **Goal**: Orchestrate student message payload limits and forward questions to the LLM to deliver response text back to the chatbox.
- **Spec sources**: Section Functional Requirements `[LLM-01]`, `[LLM-05]`; Acceptance Criteria (`[Gherkin]` Feature: Student Chatbot Interaction).
- **Criteria**: `GHERKIN-01`
- **Tests that should turn green**: `test_GHERKIN01: outside payload limit rejection and control`
- **Skeleton to fill in**: `InterfaceModule.handleChatbotInteraction(studentId, lessonId, userMessage)` in `src/modules/interface.js` and route `POST /api/chat/message` in `src/server.js`.
- **Depends on**: Slice 6, Slice 7, Slice 8, Slice 9.
- **Done when**: `test_GHERKIN01: outside payload limit rejection and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 11: Chatbot Topic Guardrail
- **Name**: Chatbot Topic Guardrail
- **Goal**: Screen incoming chat messages against the active lesson content and reject off-topic questions with HTTP 400 `{ error: 'off_topic' }`.
- **Spec sources**: Section Functional Requirements `[LLM-04]`; Section Non-Functional Requirements `[NFR-SAFE-01]`; Acceptance Criteria (Student Message Chatbox Acceptance 2).
- **Criteria**: `CHATBOX-02`
- **Tests that should turn green**: `test_CHATBOX02: rejection for off-topic question and control`
- **Skeleton to fill in**: `SafetyModule.moderateOutput(text, currentTopic)` in `src/modules/safety.js`, `InterfaceModule.handleChatbotInteraction(studentId, lessonId, userMessage)` in `src/modules/interface.js`, and route `POST /api/chat/message` in `src/server.js`.
- **Depends on**: Slice 3, Slice 10.
- **Done when**: `test_CHATBOX02: rejection for off-topic question and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 12: Practice Problem Retrieval & Pagination
- **Name**: Practice Problem Retrieval & Pagination
- **Goal**: Retrieve pre-written practice problems for a lesson while enforcing query pagination limits to prevent excessive memory load.
- **Spec sources**: Section Functional Requirements `[QUIZ-01]`, `[QUIZ-02]`.
- **Criteria**: `QUIZ-01-AC`
- **Tests that should turn green**: `test_QUIZ01_AC: rejection for excessive page size and control`
- **Skeleton to fill in**: `QuizModule.getPracticeProblems(lessonId, studentId)` in `src/modules/quiz.js` and route `GET /api/quizzes/problems` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_QUIZ01_AC: rejection for excessive page size and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 13: Quiz Problem Type Support Validation
- **Name**: Quiz Problem Type Support Validation
- **Goal**: Validate quiz submission answer objects against supported problem types (multiple choice, short answer, fill-in-blank), rejecting unrecognized types with HTTP 400.
- **Spec sources**: Section Functional Requirements `[QUIZ-02]`.
- **Criteria**: `QUIZ-02-AC`
- **Tests that should turn green**: `test_QUIZ02_AC: rejection for unknown question type and control`
- **Skeleton to fill in**: `QuizModule.submitAndGradeQuiz(quizId, studentId, answers)` in `src/modules/quiz.js` and route `POST /api/quizzes/:quizId/submit` in `src/server.js`.
- **Depends on**: None.
- **Done when**: `test_QUIZ02_AC: rejection for unknown question type and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 14: Immediate Quiz Grading & Feedback Breakdown
- **Name**: Immediate Quiz Grading & Feedback Breakdown
- **Goal**: Grade completed quiz answer submissions immediately, rejecting empty submission arrays and returning score and per-question breakdown.
- **Spec sources**: Section Functional Requirements `[QUIZ-04]`.
- **Criteria**: `QUIZ-04-AC`
- **Tests that should turn green**: `test_QUIZ04_AC: rejection for empty submission and control`
- **Skeleton to fill in**: `QuizModule.submitAndGradeQuiz(quizId, studentId, answers)` in `src/modules/quiz.js` and route `POST /api/quizzes/:quizId/submit` in `src/server.js`.
- **Depends on**: Slice 13.
- **Done when**: `test_QUIZ04_AC: rejection for empty submission and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 15: Quiz Question Fact Retrieval Validation
- **Name**: Quiz Question Fact Retrieval Validation
- **Goal**: Validate that factual premises in generated questions are directly retrievable from the referenced lesson content.
- **Spec sources**: Section Functional Requirements `[LLM-06]`; Acceptance Criteria (Valid LLM Generate Quiz Question 1).
- **Criteria**: `QUIZVAL-01`
- **Tests that should turn green**: `test_QUIZVAL01: rejection for out-of-lesson factual claims and control`
- **Skeleton to fill in**: `QuizModule.validateQuestionAgainstLesson(questionData, lessonId)` and `QuizModule.generateDynamicQuizQuestion(lessonId, studentId)` in `src/modules/quiz.js`, and routes `POST /api/quizzes/validate-question` and `POST /api/quizzes/generate` in `src/server.js`.
- **Depends on**: Slice 3.
- **Done when**: `test_QUIZVAL01: rejection for out-of-lesson factual claims and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 16: Quiz Question Valid Answer Key Validation
- **Name**: Quiz Question Valid Answer Key Validation
- **Goal**: Validate that quiz questions specify unambiguous, valid correct answers, rejecting questions missing keys or having conflicting answers.
- **Spec sources**: Acceptance Criteria (Valid LLM Generate Quiz Question 2).
- **Criteria**: `QUIZVAL-02`
- **Tests that should turn green**: `test_QUIZVAL02: rejection when lacking valid answer key and control`
- **Skeleton to fill in**: `QuizModule.validateQuestionAgainstLesson(questionData, lessonId)` and `QuizModule.generateDynamicQuizQuestion(lessonId, studentId)` in `src/modules/quiz.js`, and routes `POST /api/quizzes/validate-question` and `POST /api/quizzes/generate` in `src/server.js`.
- **Depends on**: Slice 15.
- **Done when**: `test_QUIZVAL02: rejection when lacking valid answer key and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 17: Quiz Question Schema Styling Validation
- **Name**: Quiz Question Schema Styling Validation
- **Goal**: Validate that quiz questions match the formatting and schema style of standard quiz items, rejecting raw code dumps or malformed syntax.
- **Spec sources**: Acceptance Criteria (Valid LLM Generate Quiz Question 3).
- **Criteria**: `QUIZVAL-03`
- **Tests that should turn green**: `test_QUIZVAL03: rejection for divergent styling and control`
- **Skeleton to fill in**: `QuizModule.validateQuestionAgainstLesson(questionData, lessonId)` and `QuizModule.generateDynamicQuizQuestion(lessonId, studentId)` in `src/modules/quiz.js`, and routes `POST /api/quizzes/validate-question` and `POST /api/quizzes/generate` in `src/server.js`.
- **Depends on**: Slice 16.
- **Done when**: `test_QUIZVAL03: rejection for divergent styling and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 18: Dynamic Question Generation on Content Exhaustion
- **Name**: Dynamic Question Generation on Content Exhaustion
- **Goal**: Invoke dynamic LLM question generation only when pre-written lesson practice items are fully exhausted, rejecting requests when inventory remains.
- **Spec sources**: Section Functional Requirements `[QUIZ-03]`, `[LLM-02]`.
- **Criteria**: `LLM-02-AC`
- **Tests that should turn green**: `test_LLM02_AC: dynamic generation on exhausted topic and control`
- **Skeleton to fill in**: `QuizModule.generateDynamicQuizQuestion(lessonId, studentId)` in `src/modules/quiz.js` and route `POST /api/quizzes/generate` in `src/server.js`.
- **Depends on**: Slice 8, Slice 12, Slice 15, Slice 16, Slice 17.
- **Done when**: `test_LLM02_AC: dynamic generation on exhausted topic and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 19: Instructor Student Performance Reporting
- **Name**: Instructor Student Performance Reporting
- **Goal**: Calculate aggregated student performance metrics for instructors while validating reporting date window bounds.
- **Spec sources**: Section Functional Requirements `[INST-01]`; Section Non-Functional Requirements `[NFR-SEC-01]`.
- **Criteria**: `INST-01-AC`
- **Tests that should turn green**: `test_INST01_AC: rejection for invalid reporting window and control`
- **Skeleton to fill in**: `AnalyticsModule.getStudentPerformanceReport(studentId, instructorId)` in `src/modules/analytics.js` and route `GET /api/instructors/reports/:studentId` in `src/server.js`.
- **Depends on**: Slice 14.
- **Done when**: `test_INST01_AC: rejection for invalid reporting window and control` passes and no previously passing test fails.
- **Status**: not started.

### Slice 20: Instructor LLM Report Configuration Tuning
- **Name**: Instructor LLM Report Configuration Tuning
- **Goal**: Persist instructor-customized LLM prompt parameters and criteria by subject, rejecting empty criteria payloads.
- **Spec sources**: Section Functional Requirements `[INST-02]`.
- **Criteria**: `INST-02-AC`
- **Tests that should turn green**: `test_INST02_AC: rejection for empty criteria and control`
- **Skeleton to fill in**: `AnalyticsModule.tuneReportLLMConfig(instructorId, promptConfig)` in `src/modules/analytics.js` and route `PUT /api/instructors/llm-config` in `src/server.js`.
- **Depends on**: Slice 19.
- **Done when**: `test_INST02_AC: rejection for empty criteria and control` passes and no previously passing test fails.
- **Status**: not started.

---

## 3. Unmapped Items & Residual Elements

### Criteria Fitting No Slice
- **`[NFR-OPEN-01]` (Open-source and self-hostable architecture)**: Not code-testable by automated unit/integration tests; verified via deployment and source audit.
- **`[NFR-OPEN-02]` (No reliance on proprietary software)**: Not code-testable; evaluated via dependency licensing inspection.
- **`[NFR-SAFE-02]` (Role-based access permissions across protected endpoints)**: Only initial authentication is covered in `AUTH-01`; role verification middleware across other endpoints is specified in architecture/contracts but not covered by failing tests in `acceptance.test.js`.
- **`[NFR-PERF-01]` (Chat feedback latency within 5–7 seconds)**: Real-time latency benchmark requirement; not asserted by current test suite assertions.
- **Gap checklist exploratory probes** (`test_plan.md` Section 2: Concurrency, Token Expiration, Non-Existent Lesson Reference, Malformed JSON Payload, Unauthenticated vs Rate-Limited Precedence, Pagination Limits): Defined as manual/exploratory gap probes rather than coded test cases in `acceptance.test.js`.

### Tests Fitting No Slice
- **None**: All 20 tests in `tests/acceptance.test.js` are assigned to exactly one slice.

### Functions Filled by No Slice
- **`AuthModule.verifyMFAOrPasskey(userId, verificationToken)`**: Defined in `contracts.md` for MFA/Passkey verification, but not wired to any route or tested by `acceptance.test.js`.
- **`AuthModule.authorizeRole(userId, requiredRole)`**: Defined in `contracts.md` for RBAC policy checks, but not wired as middleware to routes or tested by `acceptance.test.js`.
- **`ContentModule.getLesson(lessonId)`**: Defined in `contracts.md` and used internally by content/quiz logic, but does not have a dedicated route or unit test in `acceptance.test.js`.
- **`ContentModule.syncOfflineFiles(studentId)`**: Defined in `contracts.md` and routed to `GET /api/content/offline-sync`, but has no test in `acceptance.test.js`.

### Routes Filled by No Slice
- **`GET /api/content/offline-sync`**: Mapped in `server.js` to `ContentModule.syncOfflineFiles`, but completely unasserted by the test suite.

---

## 4. Design Questions
1. **Dynamic Quiz Generation Schema & HTTP Status Inconsistency**:
   - `test_QUIZVAL01` expects `POST /api/quizzes/generate` to return HTTP `201 Created` with `{ questionId, prompt, options, sourceLessonId }`.
   - `test_QUIZVAL02` expects `POST /api/quizzes/generate` to return HTTP `200 OK` with `{ question, correctAnswer }`.
   - `test_QUIZVAL03` expects `POST /api/quizzes/generate` to return HTTP `200 OK` with `{ question, styleMetadata }`.
   - `test_LLM02_AC` expects `POST /api/quizzes/generate` to return HTTP `200 OK` with `{ generatedQuestion: object }`.
   Should `POST /api/quizzes/generate` return HTTP 200 or 201, and how should these disparate response properties be combined into a single canonical response schema without violating any individual test?
2. **Encrypted Storage Integration**:
   - `architecture.md` specifies an encrypted database backend (PostgreSQL/SQLite) for chat logs, student records, and performance metrics (`[NFR-SEC-01]`). Since no external database process or ORM is provided in the skeleton dependencies, should slices use an encrypted SQLite file store or an in-memory mock repository implementing Node.js `crypto` AES-256-GCM encryption?
3. **Role-Based Authorization Middleware**:
   - `AuthModule.authorizeRole` is specified in `contracts.md` and `[NFR-SAFE-02]`, but `server.js` currently maps routes directly to module methods without authorization middleware. Should an Express middleware function calling `AuthModule.authorizeRole` be introduced across instructor/content routes?

---

## 5. Test Issues
1. **Conflicting Status Code & Schema in `POST /api/quizzes/generate`**:
   - In `test_QUIZVAL01`, `POST /api/quizzes/generate` expects status `201` and fields `{ questionId, prompt, options, sourceLessonId }`.
   - In `test_QUIZVAL02`, the same endpoint called with the same payload (`{ lessonId: 'bio-intro', studentId: 's1' }`) expects status `200` and fields `{ question, correctAnswer }`.
   - In `test_QUIZVAL03`, it expects status `200` and fields `{ question, styleMetadata }`.
   - In `test_LLM02_AC`, calling it with `{ lessonId: 'exhausted_lesson', studentId: 's1' }` expects status `200` and `{ generatedQuestion: expect.any(Object) }`.
   These expectations conflict regarding HTTP status (200 vs 201) and field naming (`prompt`/`options` vs `question`/`correctAnswer` vs `generatedQuestion`).
2. **Transport Encryption Protocol Check (`test_NFR_SEC01_AC` vs Other Chat Tests)**:
   - `test_NFR_SEC01_AC` tests that `x-forwarded-proto: http` returns HTTP `403`. However, neither `test_GHERKIN01` nor `test_CHATBOX02` sets the `x-forwarded-proto` header when posting to `/api/chat/message`. If the server strictly requires `x-forwarded-proto === 'https'`, `test_GHERKIN01` and `test_CHATBOX02` will be rejected with 403 instead of succeeding. The endpoint check must specifically reject `x-forwarded-proto === 'http'` rather than demanding the explicit presence of `'https'`.
3. **Missing `type` Field in Quiz Submission Answers (`test_QUIZ04_AC`)**:
   - In `test_QUIZ02_AC`, submission answers explicitly include `{ type: 'MULTIPLE_CHOICE', questionId: 'q1', answer: 'A' }`.
   - In `test_QUIZ04_AC`, answers omit the `type` property: `[{ questionId: 'q1_1', answer: 'A' }, { questionId: 'q1_2', answer: 'B' }]`.
   The submission validator must default to multiple-choice or infer the type from the question ID so that `test_QUIZ04_AC` does not fail type validation.
