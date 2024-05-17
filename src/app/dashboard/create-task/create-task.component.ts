import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from 'src/app/Model/task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
})
export class CreateTaskComponent implements AfterViewInit {
  // title: string = 'Task 1';
  @Input()
  isEditMode: boolean = false;

  @Input()
  selectedTask: Task;

  @ViewChild('taskForm') taskForm: NgForm;

  // desc: string = '';
  // priority: string = 'medium';
  // status: string = 'open';
  // assignedTo: string = 'Vishwas';
  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EmitTaskData: EventEmitter<Task> = new EventEmitter<Task>();

  ngAfterViewInit() {
    // console.log(this.selectedTask);
    setTimeout(() => {
      this.taskForm.form.patchValue(this.selectedTask);
    }, 0);
  }
  OnCloseForm() {
    this.CloseForm.emit(false);
  }
  OnFormSubmitted(form: NgForm) {
    this.EmitTaskData.emit(form.value);
    this.CloseForm.emit(false);
  }
}
