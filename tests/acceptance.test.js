const request = require('supertest');
const app = require('../src/server');

describe('Acceptance Criteria Tests', () => {

  // GHERKIN-01: Student Chatbot Interaction (Gherkin Scenario)
  describe('GHERKIN-01: Student Chatbot Interaction', () => {
    test('test_GHERKIN01: outside payload limit rejection and control', async () => {
      // Rejection: Outside limit - payload exceeding 10,000 chars
      const oversizedMessage = 'a'.repeat(10001);
      const rejectRes = await request(app)
        .post('/api/chat/message')
        .send({ studentId: 's1', lessonId: 'l1', message: oversizedMessage });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Verify nothing was created after rejection
      expect(rejectRes.body.reply).toBeUndefined();

      // Control: Inside limit - well-formed message within limit accepted
      const controlRes = await request(app)
        .post('/api/chat/message')
        .send({ studentId: 's1', lessonId: 'l1', message: 'What is a cell wall?' });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toHaveProperty('reply');
      expect(typeof controlRes.body.reply).toBe('string');
    });
  });

  // CHATBOX-01: Profane or violent speech filtering
  describe('CHATBOX-01: Student Message Chatbox Acceptance: Does not have profane or violent speech', () => {
    test('test_CHATBOX01: rejection for profane/violent input and control', async () => {
      // Rejection: Outside boundary - explicit profanity or violent threats returns safety flag
      const rejectRes = await request(app)
        .post('/api/safety/moderate-input')
        .send({ text: 'I will destroy you' });

      expect(rejectRes.status).toBe(200);
      expect(rejectRes.body).toMatchObject({
        isSafe: false,
        flagReason: expect.any(String)
      });
      // Verify nothing created / persisted in LLM logs upon rejection
      expect(rejectRes.body.reply).toBeUndefined();

      // Control: Academic question accepted
      const controlRes = await request(app)
        .post('/api/safety/moderate-input')
        .send({ text: 'Can you help me solve this math equation?' });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        isSafe: true
      });
    });
  });

  // CHATBOX-02: On topic of current subject
  describe('CHATBOX-02: Student Message Chatbox Acceptance: Is on topic of current subject', () => {
    test('test_CHATBOX02: rejection for off-topic question and control', async () => {
      // Rejection: Outside boundary - off-topic question during lesson
      const rejectRes = await request(app)
        .post('/api/chat/message')
        .send({ studentId: 's1', lessonId: 'calculus-101', message: 'What did you think of the latest Batman movie?' });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toMatchObject({
        error: 'off_topic',
        message: expect.any(String)
      });
      // Check: Nothing created or cached as a valid response upon rejection
      expect(rejectRes.body.reply).toBeUndefined();

      // Control: On-topic question referencing core terms from lesson
      const controlRes = await request(app)
        .post('/api/chat/message')
        .send({ studentId: 's1', lessonId: 'calculus-101', message: 'How do I calculate the derivative of x^2?' });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toHaveProperty('reply');
    });
  });

  // CHATBOX-03: Message rate limit
  describe('CHATBOX-03: Student Message Chatbox Acceptance: Student is not over ratelimit for messages', () => {
    test('test_CHATBOX03: rejection when exceeding rate limit and control', async () => {
      // Rejection: Outside limit - student exceeds maximum message rate limit
      const rejectRes = await request(app)
        .get('/api/llm/rate-limit')
        .query({ userId: 'rate_limited_student' });

      expect(rejectRes.status).toBe(429);
      expect(rejectRes.body).toMatchObject({
        error: 'rate_limit_exceeded',
        message: expect.any(String)
      });
      // Check: Nothing created or processed by LLM gateway upon rejection
      expect(rejectRes.body.reply).toBeUndefined();

      // Control: Inside limit - request within limit allowed
      const controlRes = await request(app)
        .get('/api/llm/rate-limit')
        .query({ userId: 'active_student' });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        isAllowed: true,
        remaining: expect.any(Number)
      });
    });
  });

  // QUIZVAL-01: Quiz question information retrieved from lesson content
  describe('QUIZVAL-01: Valid LLM Generate Quiz Question: Information towards answers can be retrieved from lesson content', () => {
    test('test_QUIZVAL01: rejection for out-of-lesson factual claims and control', async () => {
      // Rejection: Outside validation - question references facts absent from lesson
      const rejectRes = await request(app)
        .post('/api/quizzes/validate-question')
        .send({
          lessonId: 'bio-intro',
          questionData: { prompt: 'What is the capital of Mars?' }
        });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: Nothing created in quiz repository upon failure
      expect(rejectRes.body.questionId).toBeUndefined();

      // Control: Question factual premises explicitly sourced from active lesson
      const controlRes = await request(app)
        .post('/api/quizzes/generate')
        .send({ lessonId: 'bio-intro', studentId: 's1' });

      expect(controlRes.status).toBe(201);
      expect(controlRes.body).toMatchObject({
        questionId: expect.any(String),
        prompt: expect.any(String),
        options: expect.any(Array),
        sourceLessonId: expect.any(String)
      });
    });
  });

  // QUIZVAL-02: Quiz question has valid answer(s)
  describe('QUIZVAL-02: Valid LLM Generate Quiz Question: Has valid answer(s)', () => {
    test('test_QUIZVAL02: rejection when lacking valid answer key and control', async () => {
      // Rejection: Outside boundary - question lacking designated answer key or conflicting multiple keys
      const rejectRes = await request(app)
        .post('/api/quizzes/validate-question')
        .send({
          lessonId: 'bio-intro',
          questionData: { prompt: 'What is chlorophyll?', options: ['A', 'B'] } // missing correctAnswer
        });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: Nothing created in storage if answer keys are malformed or missing
      expect(rejectRes.body.questionId).toBeUndefined();

      // Control: Properly formatted question with unambiguous correct answer
      const controlRes = await request(app)
        .post('/api/quizzes/generate')
        .send({ lessonId: 'bio-intro', studentId: 's1' });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        question: expect.any(String),
        correctAnswer: expect.any(String)
      });
    });
  });

  // QUIZVAL-03: Stylized like other quiz questions
  describe('QUIZVAL-03: Valid LLM Generate Quiz Question: Stylized like other questions in quizes', () => {
    test('test_QUIZVAL03: rejection for divergent styling and control', async () => {
      // Rejection: Outside boundary - divergent raw code or unformatted syntax
      const rejectRes = await request(app)
        .post('/api/quizzes/validate-question')
        .send({
          lessonId: 'bio-intro',
          questionData: { rawDump: '```malformed syntax```' }
        });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: Nothing created when style validation fails
      expect(rejectRes.body.questionId).toBeUndefined();

      // Control: Standard multiple-choice question matching schema style
      const controlRes = await request(app)
        .post('/api/quizzes/generate')
        .send({ lessonId: 'bio-intro', studentId: 's1' });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        question: expect.any(String),
        styleMetadata: expect.any(Object)
      });
    });
  });

  // QUIZ-01-AC: Solve practice problems
  describe('QUIZ-01-AC: [QUIZ-01] Solve practice problems to study', () => {
    test('test_QUIZ01_AC: rejection for excessive page size and control', async () => {
      // Rejection: Outside limit - requesting 500 problems in one query
      const rejectRes = await request(app)
        .get('/api/quizzes/problems')
        .query({ lessonId: 'l1', limit: 500 });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');

      // Control: Inside limit - requesting 10 problems succeeds
      const controlRes = await request(app)
        .get('/api/quizzes/problems')
        .query({ lessonId: 'l1', limit: 10 });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        problems: expect.any(Array)
      });
    });
  });

  // QUIZ-02-AC: Support multiple-choice, short-answer, and fill-in-blank problem types
  describe('QUIZ-02-AC: [QUIZ-02] Support multiple-choice, short-answer, and fill-in-blank problem types', () => {
    test('test_QUIZ02_AC: rejection for unknown question type and control', async () => {
      // Rejection: Outside boundary - unknown question type enum passed in payload
      const rejectRes = await request(app)
        .post('/api/quizzes/q1/submit')
        .send({
          studentId: 's1',
          answers: [{ type: 'UNKNOWN_TYPE_XYZ', answer: 'val' }]
        });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: No invalid types stored / no score persisted
      expect(rejectRes.body.score).toBeUndefined();

      // Control: Submitting valid multiple-choice responses
      const controlRes = await request(app)
        .post('/api/quizzes/q1/submit')
        .send({
          studentId: 's1',
          answers: [{ type: 'MULTIPLE_CHOICE', questionId: 'q1', answer: 'A' }]
        });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        score: expect.any(Number)
      });
    });
  });

  // QUIZ-04-AC: Immediate grading upon finish
  describe('QUIZ-04-AC: [QUIZ-04] Immediate grading upon finish to identify mistakes', () => {
    test('test_QUIZ04_AC: rejection for empty submission and control', async () => {
      // Rejection: Outside limit - submission containing 0 answers
      const rejectRes = await request(app)
        .post('/api/quizzes/q1/submit')
        .send({ studentId: 's1', answers: [] });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: Nothing saved if payload is empty
      expect(rejectRes.body.score).toBeUndefined();

      // Control: Fully answered quiz submission
      const controlRes = await request(app)
        .post('/api/quizzes/q1/submit')
        .send({
          studentId: 's1',
          answers: [
            { questionId: 'q1_1', answer: 'A' },
            { questionId: 'q1_2', answer: 'B' }
          ]
        });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        score: expect.any(Number),
        breakdown: expect.any(Array)
      });
    });
  });

  // LLM-02-AC: Dynamic question generation when content exhausted
  describe('LLM-02-AC: [LLM-02] LLM access for student feedback and dynamic question generation', () => {
    test('test_LLM02_AC: dynamic generation on exhausted topic and control', async () => {
      // Rejection/Constraint: Topic still containing unexhausted pre-written quiz questions should reject dynamic trigger
      const rejectRes = await request(app)
        .post('/api/quizzes/generate')
        .send({ lessonId: 'unexhausted_lesson', studentId: 's1' });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: No dynamic question created if pre-written remain
      expect(rejectRes.body.generatedQuestion).toBeUndefined();

      // Control: Exhausted topic with 0 remaining items generates dynamic backup question
      const controlRes = await request(app)
        .post('/api/quizzes/generate')
        .send({ lessonId: 'exhausted_lesson', studentId: 's1' });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        generatedQuestion: expect.any(Object)
      });
    });
  });

  // LLM-03-AC: Pre-written lesson plans baseline
  describe('LLM-03-AC: [LLM-03] Pre-written lesson plans as a baseline for LLMs created by authors', () => {
    test('test_LLM03_AC: rejection for excessive lesson content length and control', async () => {
      // Rejection: Outside boundary - content length exceeding maximum storage limits (boundary >5,000 chars)
      const hugeContent = 'x'.repeat(20000);
      const rejectRes = await request(app)
        .post('/api/lessons')
        .send({
          title: 'Too Long Lesson',
          subjectId: 'sub-1',
          contentWritten: hugeContent
        });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: No record written on validation failure
      expect(rejectRes.body.lessonId).toBeUndefined();

      // Control: Valid lesson plan writeup stored successfully
      const controlRes = await request(app)
        .post('/api/lessons')
        .send({
          title: 'Cell Biology Basics',
          subjectId: 'bio-101',
          contentWritten: 'Cells are the basic structural units of all living organisms.'
        });

      expect(controlRes.status).toBe(201);
      expect(controlRes.body).toMatchObject({
        lessonId: expect.any(String)
      });
    });
  });

  // LLM-08-AC: LLM request timeout
  describe('LLM-08-AC: [LLM-08] LLM request timeout to prevent infinite loops', () => {
    test('test_LLM08_AC: timeout rejection and fast control response', async () => {
      // Rejection: Outside limit - LLM takes exceeding timeout
      const rejectRes = await request(app)
        .post('/api/llm/route')
        .send({
          prompt: 'Stall test prompt',
          options: { timeoutMs: 10 }
        });

      expect(rejectRes.status).toBe(504);
      expect(rejectRes.body).toMatchObject({
        error: 'timeout',
        message: expect.any(String)
      });
      // Check: No valid responseText returned
      expect(rejectRes.body.responseText).toBeUndefined();

      // Control: Fast response completing within timeout window
      const controlRes = await request(app)
        .post('/api/llm/route')
        .send({
          prompt: 'Explain kinetic energy',
          options: { timeoutMs: 5000 }
        });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        responseText: expect.any(String),
        modelUsed: expect.any(String)
      });
    });
  });

  // INST-01-AC: Student performance reports
  describe('INST-01-AC: [INST-01] Student performance reports for targeted instruction', () => {
    test('test_INST01_AC: rejection for invalid reporting window and control', async () => {
      // Rejection: Outside boundary - reporting window 10 years into future
      const rejectRes = await request(app)
        .get('/api/instructors/reports/s1')
        .query({ startDate: '2036-01-01', endDate: '2036-01-31' });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: No report created or leaked
      expect(rejectRes.body.metrics).toBeUndefined();

      // Control: Valid 7-day report for assigned student
      const controlRes = await request(app)
        .get('/api/instructors/reports/s1');

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        studentId: 's1',
        metrics: expect.any(Object)
      });
    });
  });

  // INST-02-AC: Tune LLM generation parameters
  describe('INST-02-AC: [INST-02] Tune LLM generation parameters for performance reports by subject', () => {
    test('test_INST02_AC: rejection for empty criteria and control', async () => {
      // Rejection: Outside boundary - empty criteria payload
      const rejectRes = await request(app)
        .put('/api/instructors/llm-config')
        .send({
          instructorId: 'inst1',
          promptConfig: { subjectId: '', criteria: '' }
        });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: No config modified on invalid input
      expect(rejectRes.body.success).toBeFalsy();

      // Control: Valid tuning parameters updated
      const controlRes = await request(app)
        .put('/api/instructors/llm-config')
        .send({
          instructorId: 'inst1',
          promptConfig: { subjectId: 'math-101', criteria: 'Focus on calculus fundamentals' }
        });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        success: true
      });
    });
  });

  // CONTENT-01-AC: Rich editor support
  describe('CONTENT-01-AC: [CONTENT-01] Rich editor supporting text styles, charts, images, video, and code', () => {
    test('test_CONTENT01_AC: rejection for unauthorized executable payload and control', async () => {
      // Rejection: Outside boundary - executable binary payload / unsafe injection
      const rejectRes = await request(app)
        .post('/api/lessons')
        .send({
          title: 'Malicious Lesson',
          subjectId: 'cs-101',
          contentWritten: '<script>eval("malicious")</script>',
          graphicalAssets: ['exploit.exe']
        });

      expect(rejectRes.status).toBe(400);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: No unsafe payload persisted
      expect(rejectRes.body.lessonId).toBeUndefined();

      // Control: Standard markdown, image, and code block formatting accepted
      const controlRes = await request(app)
        .post('/api/lessons')
        .send({
          title: 'Introduction to Algorithms',
          subjectId: 'cs-101',
          contentWritten: '# Sorting\n```python\ndef sort(arr): return sorted(arr)\n```',
          graphicalAssets: ['diagram.png']
        });

      expect(controlRes.status).toBe(201);
      expect(controlRes.body).toMatchObject({
        lessonId: expect.any(String)
      });
    });
  });

  // CONTENT-02-AC: Teacher custom notes
  describe('CONTENT-02-AC: [CONTENT-02] Teacher custom notes attached to pre-written plans', () => {
    test('test_CONTENT02_AC: rejection for non-existent lesson and control', async () => {
      // Rejection: Note creation for non-existent lesson ID
      const rejectRes = await request(app)
        .post('/api/lessons/non-existent-lesson-id/notes')
        .send({
          instructorId: 'inst1',
          noteContent: 'Important notes for class.'
        });

      expect(rejectRes.status).toBe(404);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: No note created for non-existent lesson
      expect(rejectRes.body.noteId).toBeUndefined();

      // Control: Valid teacher note attached to existing lesson
      const controlRes = await request(app)
        .post('/api/lessons/l1/notes')
        .send({
          instructorId: 'inst1',
          noteContent: 'Remember to read chapter 3 before next lecture.'
        });

      expect(controlRes.status).toBe(201);
      expect(controlRes.body).toMatchObject({
        noteId: expect.any(String)
      });
    });
  });

  // NFR-SEC-01-AC: Encryption in transit and at rest
  describe('NFR-SEC-01-AC: [NFR-SEC-01] Encryption of chat logs, student records, and metrics in transit and at rest', () => {
    test('test_NFR_SEC01_AC: rejection for unencrypted plain HTTP transport and control', async () => {
      // Rejection: Outside boundary - plain unencrypted HTTP transport rejected (requires TLS)
      const rejectRes = await request(app)
        .post('/api/chat/message')
        .set('x-forwarded-proto', 'http')
        .send({ studentId: 's1', lessonId: 'l1', message: 'Hello' });

      expect(rejectRes.status).toBe(403);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: Unencrypted traffic rejected, nothing created
      expect(rejectRes.body.reply).toBeUndefined();

      // Control: Secure TLS channel request accepted
      const controlRes = await request(app)
        .post('/api/chat/message')
        .set('x-forwarded-proto', 'https')
        .send({ studentId: 's1', lessonId: 'l1', message: 'Explain mitochondria.' });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        reply: expect.any(String)
      });
    });
  });

  // NFR-PERF-02-AC: Mobile and low-powered device optimization
  describe('NFR-PERF-02-AC: [NFR-PERF-02] Optimization for mobile and low-powered devices', () => {
    test('test_NFR_PERF02_AC: static layout asset delivery and size check', async () => {
      // Control: Optimized static UI asset delivery under 200KB
      const controlRes = await request(app)
        .get('/');

      expect(controlRes.status).toBe(200);
      // Expected body: HTML static layout string
      const bodyText = typeof controlRes.body === 'string' ? controlRes.body : controlRes.text;
      expect(bodyText).toBeDefined();
      expect(bodyText.length).toBeLessThan(200 * 1024); // under 200KB limit
    });
  });

  // AUTH-01: Institutional credential login and JWT
  describe('AUTH-01: [AUTH-01] User authentication via institutional credentials and signed JSON Web Tokens', () => {
    test('test_AUTH01: rejection for invalid credentials and control', async () => {
      // Rejection: Invalid credentials rejected
      const rejectRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'student1',
          password: 'wrong_password'
        });

      expect(rejectRes.status).toBe(401);
      expect(rejectRes.body).toHaveProperty('error');
      // Check: No token issued or session state created upon rejection
      expect(rejectRes.body.token).toBeUndefined();

      // Control: Valid credentials returns token, userId, and role
      const controlRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'student1',
          password: 'correct_password'
        });

      expect(controlRes.status).toBe(200);
      expect(controlRes.body).toMatchObject({
        token: expect.any(String),
        userId: expect.any(String),
        role: expect.any(String)
      });
    });
  });

});
