import { para11abs1Nr8f } from 'app/questions/para11abs1Nr8f';
import { questionsPara11Abs1Nr358a } from 'app/questions/questionsPara11Abs1Nr358a';

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
  ["para11", {name: "§11 Abs. 1 Nr. 4, 5, 8a", color: "#78edb3", questions: questionsPara11Abs1Nr358a}],
  ["mc", {name: "§11 Abs. 1 Nr. 8f", color: "#f7a776", questions: para11abs1Nr8f}],
]);


