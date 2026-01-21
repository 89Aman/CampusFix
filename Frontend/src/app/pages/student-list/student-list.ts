import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IssueService, Issue } from '../../services/issue.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit {
  issues: Issue[] = [];
  loading = true;

  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.issueService.issues$.subscribe(data => {
      this.issues = data;
      this.loading = false;
    });
  }

  upvote(id: number) {
    this.issueService.upvoteIssue(id).subscribe({
      next: (res) => console.log('Upvoted', res),
      error: (err) => console.error('Upvote failed', err)
    });
  }
}
