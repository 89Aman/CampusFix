import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IssueService } from '../../services/issue.service';

@Component({
    selector: 'app-student-submit',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './student-submit.component.html',
    styleUrl: './student-submit.component.css'
})
export class StudentSubmitComponent {
    issue = {
        summary: '',
        location: '',
        description: '',
        photo: null as string | null
    };
    selectedFile: File | null = null;
    isSubmitting = false;

    constructor(private issueService: IssueService, private router: Router) { }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.issue.photo = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    submitIssue() {
        if (!this.issue.description || !this.issue.location) {
            alert('Please fill in Location and Description');
            return;
        }

        this.isSubmitting = true;
        const formData = new FormData();

        // Combine summary + description as backend expects description
        const fullDescription = this.issue.summary
            ? `[${this.issue.summary}] ${this.issue.description}`
            : this.issue.description;

        formData.append('description', fullDescription);
        formData.append('location', this.issue.location);

        if (this.selectedFile) {
            formData.append('image', this.selectedFile);
        }

        this.issueService.reportIssue(formData).subscribe({
            next: (res) => {
                console.log('Issue reported:', res);
                alert('Issue reported successfully!');
                this.isSubmitting = false;
                // Reset form
                this.issue = { summary: '', location: '', description: '', photo: null };
                this.selectedFile = null;
                this.router.navigate(['/student/list']);
            },
            error: (err) => {
                console.error('Submission failed', err);
                alert('Failed to report issue. See console.');
                this.isSubmitting = false;
            }
        });
    }
}
