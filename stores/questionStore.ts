// stores/useQuestionStore.ts
import { create } from "zustand";
import { Question } from "../types/question"; // Adjust the path according to your project structure

interface QuestionStore {
  questions: Question[];
  homeworkId: string;
  addQuestion: (question: Question) => void;
  removeQuestion: (id: number) => void;
  clearQuestions: () => void;
  setHomeworkId: (id: string) => void;
  updateQuestionTime: (index: number, timeSpent: number) => void;
  updateQuestionExamin: (index: number, isCorrect: boolean) => void;
}

const useQuestionStore = create<QuestionStore>((set: any) => ({
  questions: [],
  homeworkId: "",
  addQuestion: (question: Question) =>
    set((state: any) => ({
      questions: [...state.questions, question],
    })),
  removeQuestion: (id: number) =>
    set((state: any) => ({
      questions: state.questions.filter(
        (question: Question) => question.id !== id,
      ),
    })),
  setHomeworkId: (homeworkId: string) => set({ homeworkId: homeworkId }),
  clearQuestions: () => set({ questions: [] }),
  updateQuestionTime: (index: number, timeSpent: number) =>
    set((state: any) => {
      const updatedQuestions = [...state.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        completion_time: timeSpent,
      };
      return { questions: updatedQuestions };
    }),
  updateQuestionExamin: (index: number, isCorrect: boolean) =>
    set((state: any) => {
      const updatedQuestions = [...state.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        isCorrect: isCorrect,
      };
      return { questions: updatedQuestions };
    }),
}));

export default useQuestionStore;
