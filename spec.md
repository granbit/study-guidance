# Description
This project is a digital learning and teaching system that will support students to learn topics they struggle with or are interested in and with tools to support teachers to create study plans targeted for specific students. This involves tested lesson write ups, visual aids and practice problems. These features will also be supported by LLMs to give students a way to access immediate feedback to their questions and confusion.
  
# Goals

Help students to learn new material
Help students study and retain material they have been taught
Support teachers with data to be able to narrow down problems with students

# Domain Model
	The education system and all things need to interact with it.
	Students and teachers are the primary users of the software, but education instuitions will verify and vet efficiency of the software. 

## Actors
	Student
	Instructor : Can support one or more students
## Objects
	Plan of Study : Students will each have one gather from data from Lessons
	Lessons
	Content-Audio : Content is part of Lessons
	Content-Graphical : Content is part of Lessons
	Content-Written : Content is part of Lessons
	Subjects
	Quizes
	

# Functional Requirements

[QUIZ-01] As a Student \
I want to solve practice problems \
So that I can study 

[QUIZ-02] As a Student \
Quizes need to support different types of problems (Muliple Choice, Short-Answer, Fill-in-Blank) \
So I can be ready for real tests with those types problems 

[QUIZ-03] As a Student \
If there is no more pre-written quizes, I would want LLMs to generate more pratice problems \
So I can keep studying even if content is exhausted 

[QUIZ-04] As a Student \
I want to have quizes be graded as soon as I finish \
So I can know where I make mistakes 

[LLM-01] As a Student \
I want to have immediate feedback \
So that I can stay engaged \
[LLM-02] The guided learning software will need some access to LLMs to be able to give feedback to students and generate questions if the existing lesson runs out. \
[LLM-03] The guided learning software will need pre-written lesson plans so that LLMs will have a baseline to work off, instead of the pre-existing weights attributed to them. The software itself will have lesson authors \
[LLM-04] The guided learning software will have strong guardrails to prevent students being able to let it go off topic \
[LLM-05] The student LLM guide will get current lesson plan and student history to be able to answer their questions on their level \
[LLM-06] Any question an LLM generates for a quiz needs to be validated against the lesson plan's infomation. 

[INST-01] As an Instructor \
I want to have student performance reports \
So that I can create well suited instruction for students. \
[INST-02] As an Insturctor \
I want to be able to tune the LLM that generates student performance reports \
So I can make it fit whatever criteria that works for certain subjects 

# Acceptance Criteria
[Gherkin] Feature: Student Chatbot Interaction \
		Scenario: Student asks a question to chatbot \
		Student interacts with chatbot box \
		When the student enters a question into chatbox’s text box \
		And students’ presses the send \
		Then student’s question is sent to LLM and then returned to the chatbox 
