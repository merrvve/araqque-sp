import { Question } from "./question";

export interface QuizResult {
  id?: string;
  trainer_id?: string;
  created_at?: string;
  student_id: string;
  homework_id: string;
  questions: Question[];
}
