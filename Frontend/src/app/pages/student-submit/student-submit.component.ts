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
            // Compress image before upload
            this.compressImage(file).then(compressedFile => {
                this.selectedFile = compressedFile;
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.issue.photo = e.target.result;
                };
                reader.readAsDataURL(compressedFile);
            });
        }
    }

    compressImage(file: File): Promise<File> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event: any) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            resolve(compressedFile);
                        } else {
                            resolve(file);
                        }
                    }, 'image/jpeg', 0.8);
                };
            };
        });
    }

    submitIssue() {
        if (!this.issue.description || !this.issue.location) {
            return;
        }

        this.isSubmitting = true;
        const formData = new FormData();

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
                this.isSubmitting = false;
                // Reset form
                this.issue = { summary: '', location: '', description: '', photo: null };
                this.selectedFile = null;
                // Navigate to list to see the submitted issue
                this.router.navigate(['/student/list']);
            },
            error: (err) => {
                console.error('Submission failed', err);
                this.isSubmitting = false;
            }
        });
    }
}
