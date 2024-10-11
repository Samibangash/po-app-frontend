import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApprovalWorkflowService {
  constructor(private http: HttpClient) {}

  // Method to save approval workflow
  saveApprovalWorkflow(workflow: any): Observable<any> {
    return this.http.post('/api/approval-workflow', workflow);
  }
}
