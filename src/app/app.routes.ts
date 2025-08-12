import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { QuizComponent } from 'app/quiz/quiz.component';

export const routes: Routes = [
  { path: 'quiz/:categories', component: QuizComponent },
  { path: '', component: DashboardComponent },
];
