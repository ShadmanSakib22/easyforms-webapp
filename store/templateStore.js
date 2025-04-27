import { create } from "zustand";

let questionIdCounter = 0;
let optionIdCounter = 0;

export const useTemplateStore = create((set) => ({
  title: "",
  description: "",
  topic: "general",
  tags: [],
  thumbnailUrl: "",
  invitedUsers: [],
  accessType: "public",
  questions: [],
  selectedMode: "new",
  selectedTemplate: null,

  // Setters
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setTopic: (topic) => set({ topic }),
  setTags: (tags) => set({ tags }),
  setThumbnailUrl: (thumbnailUrl) => set({ thumbnailUrl }),
  setInvitedUsers: (invitedUsers) => set({ invitedUsers }),
  setAccessType: (accessType) => set({ accessType }),
  setQuestions: (questions) => set({ questions }),
  setSelectedMode: (selectedMode) => set({ selectedMode }),
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),

  addQuestion: () =>
    set((state) => ({
      questions: [
        ...state.questions,
        {
          id: questionIdCounter++,
          label: "",
          description: "",
          show: true,
          required: false,
          type: "single-line",
          placeholder: "",
          options: [],
        },
      ],
    })),

  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),

  handleQuestionChange: (id, field, value) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    })),

  handleOptionChange: (qId, optId, field, value) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.id !== qId) return q;

        return {
          ...q,
          options: q.options.map((opt) =>
            opt.id === optId ? { ...opt, [field]: value } : opt
          ),
        };
      }),
    })),

  addOptionToQuestion: (qId) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === qId
          ? q.options.length < 4
            ? {
                ...q,
                options: [...q.options, { id: optionIdCounter++, text: "" }],
              }
            : q // return the original question if already 4 options
          : q
      ),
    })),

  removeOptionFromQuestion: (qId, optId) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.filter((opt) => opt.id !== optId),
            }
          : q
      ),
    })),
}));
