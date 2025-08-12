import { questionsMc } from 'app/questions/mc';
import { questionsPara11 } from './para11';

export type Question = {
  prompt: string,
  answers: string[],
  categoryKey?: string,
  categoryName?: string,
  categoryColor?: string,
}

export function q(prompt: string, answers: string[]): Question {
  return {
    prompt,
    answers, //mark correct answers with `#` prefix
  }
}

export type Category = {
  name: string,
  color: string,
  questions: Question[],
}

export const questionCategories = new Map<string, Category>([
  ["para11", {name: "§11 Fragen", color: "#78edb3", questions: questionsPara11}],
  ["mc", {name: "MC Fragen", color: "#f7a776", questions: questionsMc}],
]);


