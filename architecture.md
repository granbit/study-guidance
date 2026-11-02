## 1. Overview

This system is a self-hostable digital learning platform built with Node.js and HTML/CSS/JS, designed to support students with personalized lessons, quizzes, and LLM-powered feedback while providing instructors with performance reports and content management tools. The architecture relies on a monolithic Node.js backend connected to any choice database with encrypted storage, multi-LLM failover routing, and server-delivered static layouts optimized for low-powered devices and offline capabilities.

---

## 2. Modules

| Module | Responsibility | May depend on |
| --- | --- | --- |
| **Auth Module** | Handles user authentication, role-based permissions, OAuth, and MFA/Passkey verification. | *None* |
| **Content Module** | Manages rich lessons, teacher notes, media files, and offline file synchronization. | Auth Module |
| **Quiz Module** | Manages pre-written and dynamic practice problems, grading, and answer validation against lesson content. | Content Module, LLM Gateway Module |
| **LLM Gateway Module** | Manages multi-LLM routing, cost/accuracy tuning, failover, timeouts, and request rate limiting. | *None* |
| **Safety Module** | Enforces lightweight regex/heuristics filtering and optional LLM layers for student input and LLM output moderation. | LLM Gateway Module |
| **Analytics Module** | Generates student performance reports and tracks engagement metrics for instructors. | Content Module, Quiz Module, LLM Gateway Module |
| **Interface Module** | Delivers static pages, client-side HTML/CSS/JS assets, and renders the browser-based UI for users. | Content Module, Quiz Module, Safety Module |

---

## 3. Request flow

**Scenario: Student asks a question to chatbot** (Consistent with `[LLM-01]`, `[LLM-05]`, `[LLM-08]`, `[NFR-SAFE-01]`, `[NFR-PERF-01]`, and the Student Chatbot Interaction acceptance criteria).

1. **User Input:** The student enters a question into the chatbox text box within the browser interface and presses send (Interface Module).
2. **Authentication & Session Check:** The backend verifies the student's active session and role permissions via the Auth Module.
3. **Input Moderation & Rate Limiting:** The Safety Module applies lightweight regex/heuristics to check the input message for profane or violent speech, and the LLM Gateway Module checks if the student is over their message rate limit.
4. **Context Gathering:** The backend retrieves the current lesson plan and student history.
5. **LLM Execution with Timeout:** The LLM Gateway Module routes the prompt to the configured primary LLM with a strict timeout constraint to prevent infinite loops. If it fails, it triggers the multi-LLM failover mechanism.
6. **Output Moderation & Response Delivery:** The Safety Module scans the LLM output for off-topic drift, hallucinations, or inappropriate language, ensuring the response is delivered back to the chatbox interface within the performance window.

---

## 4. Design decisions

| Decision | Reason |
| --- | --- |
| **Software suite designed for self-hosting by educational institutions or instructors.** | Key design decision. |
| **Open-source core architecture relying on modular integration points for proprietary modules.** | Key design decision. |
| **Configurable institutional login supporting OAuth, username/password, optional MFA, and mandatory physical passkeys for administrators/content writers.** | Key design decision. |
| **Any choice (default: Postgres, Option: SQLite ) database backend with encryption for stored data.** | Backend requirement (`Backend supported by database with encryption`). |
| **Database will be used for written content stores. Writeups, reviews, quizes** | Key design decision |
| **Cloud object storage with support for local server disk storage for media files.** | Key design decision. |
| **Built-in multi-LLM failover tuned for cost, accuracy, and administrative requirements.** | Key design decision and requirement `[LLM-02]`. |
| **Safety layer implementing lightweight Node.js regex/heuristics with optional local/cloud LLM layers.** | Key design decision and requirements `[LLM-04]`, `[LLM-09]`, and `[NFR-SAFE-01]`. |
| **Rate limiting for LLM requests to prevent user abuse and control costs, alongside content scraping rate limits.** | Key design decision and requirement `[LLM-07]`. |
| **Node.js delivery of static pages for interface rendering on mobile and low-powered laptops, with offline file downloads. Offline downloads are not synced** | Key design decision and constraints. |
| **Role-based permissions enforced across all backend endpoints.** | Requirement `[NFR-SAFE-02]`. |
| **Encryption of chat logs, student records, and performance metrics in transit and at rest.** | Requirement `[NFR-SEC-01]`. |

---

## 5. Constraints and known limits

* **Constraints:** Built using Node.js and HTML/CSS/JS as a browser-based application optimized for low-powered laptops and strong mobile support, utilizing a multi-LLM structure with self-hosted failover options.
* **Limits:** This design does not handle real-time multi-user collaborative editing out-of-the-box, nor does it natively support edge-computing worker distributions for massive high-concurrency enterprise scale without scaling the Node.js server instances. If user requirements expanded to millions of concurrent active chat sessions or real-time video streaming classrooms, the monolithic Node.js backend would need to transition into a distributed microservices architecture with dedicated message queues and distributed caching.
---

## 6. Out of scope

* Native mobile applications (iOS/Android app store packages).
* Automated hardware provisioning or cloud infrastructure management for self-hosted instances.
* Direct integration with third-party Learning Management Systems (LMS) beyond the specified OAuth and authentication hooks.

---

