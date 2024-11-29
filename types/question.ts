export interface Question {
    id: number;
    question_type: string;
    question: string;
    choices: string[];
    correct_answer: string;
    student_answer?: string;
    completion_time?: number;
}
