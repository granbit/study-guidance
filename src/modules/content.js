const crypto = require('crypto');

class NotImplementedError extends Error {
  constructor(message = "Method not implemented") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class ValidationError extends Error {
  constructor(message = "Validation error") {
    super(message);
    this.name = "ValidationError";
  }
}

class LessonNotFoundError extends Error {
  constructor(message = "Lesson not found") {
    super(message);
    this.name = "LessonNotFoundError";
  }
}

const EXECUTABLE_EXTENSION_REGEX = /\.(exe|bat|cmd|sh|bin|msi|dll|com|vbs|ps1|jar)$/i;
const SCRIPT_INJECTION_REGEX = /<script\b|eval\s*\(|javascript:/i;
const MAX_LESSON_CONTENT_LENGTH = 5000;
const MAX_NOTE_CONTENT_LENGTH = 1000;

class ContentModule {
  constructor(initialLessons = null) {
    this.lessons = initialLessons || new Map([
      ['l1', {
        lessonId: 'l1',
        title: 'Biology: Cell Structure',
        subjectId: 'bio-101',
        contentWritten: 'Cells are the basic structural units of all living organisms. Plant cells contain a cell wall and chloroplasts.',
        graphicalAssets: ['diagram.png'],
        audioAssets: [],
        notes: []
      }],
      ['calculus-101', {
        lessonId: 'calculus-101',
        title: 'Calculus 101: Derivatives',
        subjectId: 'math-101',
        contentWritten: 'Calculus fundamentals and differentiation. The derivative of x^2 is 2x.',
        graphicalAssets: [],
        audioAssets: [],
        notes: []
      }],
      ['bio-intro', {
        lessonId: 'bio-intro',
        title: 'Introduction to Biology',
        subjectId: 'bio-101',
        contentWritten: 'Photosynthesis is the process by which green plants and certain other organisms transform light energy into chemical energy. Chlorophyll is the green pigment in plants.',
        graphicalAssets: [],
        audioAssets: [],
        notes: []
      }],
      ['exhausted_lesson', {
        lessonId: 'exhausted_lesson',
        title: 'Exhausted Lesson Topic',
        subjectId: 'general-101',
        contentWritten: 'Lesson content with exhausted pre-written questions.',
        graphicalAssets: [],
        audioAssets: [],
        notes: []
      }],
      ['unexhausted_lesson', {
        lessonId: 'unexhausted_lesson',
        title: 'Unexhausted Lesson Topic',
        subjectId: 'general-101',
        contentWritten: 'Lesson content with pre-written questions remaining in inventory.',
        graphicalAssets: [],
        audioAssets: [],
        notes: []
      }]
    ]);
    this.notes = new Map();
  }

  async createLesson(lessonData) {
    if (!lessonData || typeof lessonData !== 'object') {
      throw new ValidationError("Lesson data must be an object");
    }

    const { title, subjectId, contentWritten, graphicalAssets = [], audioAssets = [] } = lessonData;

    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new ValidationError("Title is required and must be a non-empty string");
    }

    if (!subjectId || typeof subjectId !== 'string' || !subjectId.trim()) {
      throw new ValidationError("Subject ID is required and must be a non-empty string");
    }

    if (!contentWritten || typeof contentWritten !== 'string') {
      throw new ValidationError("contentWritten is required and must be a string");
    }

    if (contentWritten.length > MAX_LESSON_CONTENT_LENGTH) {
      throw new ValidationError(`Content length ${contentWritten.length} exceeds maximum allowed limit of ${MAX_LESSON_CONTENT_LENGTH} characters`);
    }

    if (SCRIPT_INJECTION_REGEX.test(contentWritten)) {
      throw new ValidationError("Unauthorized script or code injection detected in lesson content");
    }

    const allAssets = [...graphicalAssets, ...audioAssets];
    for (const asset of allAssets) {
      if (typeof asset === 'string' && EXECUTABLE_EXTENSION_REGEX.test(asset)) {
        throw new ValidationError(`Unauthorized executable payload detected in asset: ${asset}`);
      }
    }

    const lessonId = 'lesson_' + crypto.randomUUID();
    const newLesson = {
      lessonId,
      title: title.trim(),
      subjectId: subjectId.trim(),
      contentWritten,
      graphicalAssets: Array.isArray(graphicalAssets) ? [...graphicalAssets] : [],
      audioAssets: Array.isArray(audioAssets) ? [...audioAssets] : [],
      notes: [],
      createdAt: new Date().toISOString()
    };

    this.lessons.set(lessonId, newLesson);
    return { lessonId };
  }

  async addTeacherNote(lessonId, instructorId, noteContent) {
    if (!lessonId || typeof lessonId !== 'string') {
      throw new ValidationError("lessonId is required");
    }

    if (!instructorId || typeof instructorId !== 'string') {
      throw new ValidationError("instructorId is required");
    }

    if (!noteContent || typeof noteContent !== 'string') {
      throw new ValidationError("noteContent is required");
    }

    if (noteContent.length > MAX_NOTE_CONTENT_LENGTH) {
      throw new ValidationError(`noteContent exceeds maximum limit of ${MAX_NOTE_CONTENT_LENGTH} characters`);
    }

    const lesson = this.lessons.get(lessonId);
    if (!lesson) {
      throw new LessonNotFoundError(`Lesson with ID ${lessonId} does not exist`);
    }

    const noteId = 'note_' + crypto.randomUUID();
    const note = {
      noteId,
      lessonId,
      instructorId,
      noteContent,
      createdAt: new Date().toISOString()
    };

    this.notes.set(noteId, note);
    lesson.notes.push(note);

    return { noteId };
  }

  async getLesson(lessonId) {
    if (!lessonId || typeof lessonId !== 'string') {
      throw new ValidationError("lessonId is required");
    }

    const lesson = this.lessons.get(lessonId);
    if (!lesson) {
      throw new LessonNotFoundError(`Lesson with ID ${lessonId} does not exist`);
    }

    return lesson;
  }

  async syncOfflineFiles(studentId) {
    throw new NotImplementedError("ContentModule.syncOfflineFiles not implemented");
  }
}

module.exports = {
  ContentModule,
  NotImplementedError,
  ValidationError,
  LessonNotFoundError
};