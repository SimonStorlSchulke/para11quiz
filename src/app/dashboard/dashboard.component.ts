import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { questionCategories } from 'app/questions/questions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  categories = Array.from(questionCategories.keys());
  questionCategories = questionCategories;

  checkboxForm: FormGroup;
  checkedNames: string[] = [];
  submitEnabled = false;
  showResetStreaksMap = false;

  constructor(private fb: FormBuilder, private router: Router) {
    const controlsConfig: any = {};
    for (const name of this.categories) {
      controlsConfig[name] = [false]; // default unchecked
    }
    this.checkboxForm = this.fb.group(controlsConfig);
  }

  updateSubmitEnabled() {
    this.checkedNames = [];

    for (const key of Object.keys(this.checkboxForm.controls)) {
      if (this.checkboxForm.get(key)?.value) {
        this.checkedNames.push(key);
      }
    }
    this.checkedNames.sort();
    this.submitEnabled = this.checkedNames.length > 0;
  }

  submit() {
    this.router.navigate(['quiz', this.checkedNames.join(",")]);
  }

  resetStreaks() {
    console.log("streakMap-" + this.checkedNames.join(","))
    localStorage.removeItem("streakMap-" + this.checkedNames.join(","));
    this.showResetStreaksMap = false;
    window.alert("Fortschritt zurückgesetzt für Kategorien " + this.checkedNames.join(","));
  }

  showResetStreaks(show: boolean) {
    this.showResetStreaksMap = show;
  }
}
