import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafetyService } from '../../services/safety.service';

@Component({
  selector: 'app-safety',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './safety.html',
  styleUrl: './safety.css',
})
export class Safety {
  description = '';
  location = '';
  selectedFile: File | null = null;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private safetyService: SafetyService) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitReport(): void {
    if (!this.description.trim() || !this.location.trim()) {
      this.submitError = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = false;

    this.safetyService.reportIncident(
      this.description,
      this.location,
      this.selectedFile ?? undefined
    ).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.description = '';
        this.location = '';
        this.selectedFile = null;
        this.isSubmitting = false;
      },
      error: (err) => {
        this.submitError = 'Failed to submit report. Please try again.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }

  callHelpline(): void {
    window.location.href = 'tel:1091';
  }

  playSiren(): void {
    // Play siren sound - for MVP just an alert
    alert('🚨 SIREN ACTIVATED! 🚨\n\nThis would trigger a loud alarm sound.');
  }
}
