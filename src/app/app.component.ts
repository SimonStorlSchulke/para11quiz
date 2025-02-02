import { Component, OnInit } from '@angular/core';
import { Question, allQuestions } from './questions';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'para11quiz';

  questions = [allQuestions[0], allQuestions[1], allQuestions[2], allQuestions[3]];

  streakMap = new Map<number, number>();
  currentQuestionIndex = this.getBiasedRandomQuestionId();
  currentQuestion$ = new BehaviorSubject<Question>(this.questions[this.currentQuestionIndex]);
  checkedAnswers = new Set<number>();

  submittedAnswers = new Set<number>();


  hasSubmitted = false;

  ngOnInit(): void {
    const save = localStorage.getItem('streakMap') ?? "[]";
    this.streakMap = new Map(JSON.parse(save));
  }

  submit() {
    this.submittedAnswers = this.checkedAnswers;
    this.hasSubmitted = true;

    let allCorrect = true;

    for (let i = 0; i < this.currentQuestion$.value.answers.length; i++){
      const state = this.getAnswerState(i);
      if (state == "wrong-show-correct" || state == "wrong") {
        allCorrect = false;
      }
    }

    if (this.streakMap.has(this.currentQuestionIndex)) {
      let streakNumber = allCorrect ? this.streakMap.get(this.currentQuestionIndex)! + 1 : 0;

      if (streakNumber == 3) streakNumber += 4; //ab 3 gilt frage als gelernt und sollte seltener drankommen

      this.streakMap.set(this.currentQuestionIndex, streakNumber);
    } else {
      this.streakMap.set(this.currentQuestionIndex, allCorrect ? 1 : 0);
    }

    localStorage.setItem("streakMap", JSON.stringify(Array.from(this.streakMap.entries())));
  }

  getLearnedQuestionsAmount(): number {
    let learned = 0;
    this.streakMap.forEach((value, key) => {
      if(value >= 3){
        learned++;
      }
    });
    return learned;
  }

  getLearnedQuestionsColor() {
    const learned = this.getLearnedQuestionsAmount();
    if(learned / this.questions.length > 0.8) return "green";
    if(learned / this.questions.length > 0.5) return "yellow";
    return "red";
  }

  getPointsForCurrentQuestion() {
    return this.streakMap.get(this.currentQuestionIndex) ?? 0;
  }

  getAnswerState(answerId: number): "none" | "correct" | "wrong" | "wrong-show-correct" {
    if(!this.hasSubmitted) return "none";

    const isCorrect = this.currentQuestion$.value.answers[answerId].startsWith("#");

    if(isCorrect && this.submittedAnswers.has(answerId)) return "correct";
    if(isCorrect && !this.submittedAnswers.has(answerId)) return "wrong-show-correct";
    if(!isCorrect && !this.submittedAnswers.has(answerId)) return "none";
    if(!isCorrect && this.submittedAnswers.has(answerId)) return "wrong";
    return "none";
  }

  getBiasedRandomQuestionId(): number {
    let weightedQuestions: { index: number; weight: number }[] = [];

    this.questions.forEach((_, i) => {
      const streakBias = this.streakMap.get(i) ?? 0; // Default to 0 if not in the map
      const weight = 1 / (1 + streakBias); // Inverse weight: More correct answers → Lower weight

      weightedQuestions.push({ index: i, weight });
    });

    const totalWeight = weightedQuestions.reduce((sum, q) => sum + q.weight, 0);

    let threshold = Math.random() * totalWeight;

    for (let q of weightedQuestions) {
      threshold -= q.weight;
      if (threshold <= 0) {
        return q.index;
      }
    }

    return 0;
  }

  nextRandomQuestion() {
    this.checkedAnswers = new Set<number>();

    let newQuestion = this.getBiasedRandomQuestionId();

    // retry twice to not get the same question twice - ugly and stupid but why not.
    if(newQuestion == this.currentQuestionIndex) newQuestion = this.getBiasedRandomQuestionId();
    if(newQuestion == this.currentQuestionIndex) newQuestion = this.getBiasedRandomQuestionId();

    this.currentQuestionIndex = newQuestion;
    const randomQuestion = this.questions[this.currentQuestionIndex];

    this.shuffle(randomQuestion);

    this.currentQuestion$.next(randomQuestion);
    this.hasSubmitted = false;
  }

  displayAnswer(answer: string): string {
    return answer.replace("#", "")
  }


  shuffle(question: Question) {
    let currentIndex = question.answers.length;

    while (currentIndex != 0) {

      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [question.answers[currentIndex], question.answers[randomIndex]] = [
        question.answers[randomIndex], question.answers[currentIndex]];
    }
  }

  checkAnswer(checked: any, id: number): void {
    const isChecked = checked.currentTarget.checked;
    if(isChecked) {
      this.checkedAnswers.add(id);
    } else {
      this.checkedAnswers.delete(id);
    }
  }
}
