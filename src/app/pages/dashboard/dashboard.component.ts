import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service'; // Correctly inject AuthService
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  purchaseOrders: any[] = [];
  currentUserRole: number | null = null; // Store the current user's role

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCurrentUserRole();
    this.fetchPurchaseOrders();
  }

  fetchCurrentUserRole() {
    // Use the AuthService to get the current user
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          console.log('asdfasd');

          this.currentUserRole = user.roleId; // Set the current user's role
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
      },
    });
  }

  fetchPurchaseOrders() {
    this.apiService.getPurchaseOrders().subscribe({
      next: (response: any) => {
        if (response.responseStatus === 'Success') {
          this.purchaseOrders = response.data.map((po: any) => ({
            id: po.id,
            poNumber: po.poNumber,
            description: po.description,
            totalAmount: po.totalAmount,
            status: this.getCurrentStatus(po.approvalWorkflows ?? [], po), // Ensure approvalWorkflows is an array
            approvalWorkflows: (po.approvalWorkflows ?? []).map(
              (workflow: any) => ({
                roleName: this.getRoleName(workflow.user.role),
                approvalLevel: workflow.approvalLevel,
                status: workflow.status,
              })
            ),
          }));
        }
      },
      error: (error) => {
        console.error('Error fetching POs:', error);
      },
    });
  }

  getCurrentStatus(approvalWorkflows: any[], po: any): string {
    const pendingWorkflow = approvalWorkflows.find(
      (workflow) => workflow.status === 'Pending'
    );
    if (pendingWorkflow) {
      const level = pendingWorkflow.approvalLevel;
      return `Pending Level ${level} Approval`;
    }
    return po.status;
  }

  getRoleName(roleId: string): string {
    switch (roleId) {
      case '2':
        return 'Team Lead';
      case '3':
        return 'Department Manager';
      case '4':
        return 'Finance Manager';
      default:
        return 'Unknown Role';
    }
  }

  approvePO(poNumber: string) {
    console.log(`Approving PO: ${poNumber}`);
    // Implement the API call to approve the PO here
  }

  rejectPO(poNumber: string) {
    console.log(`Rejecting PO: ${poNumber}`);
    // Implement the API call to reject the PO here
  }

  generatePdf(id: string) {
    this.apiService.generatePdf(id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = new Blob([response.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PO-${id}.pdf`; // Downloaded PDF name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      error: (error) => {
        console.error(`Error generating PDF for PO ${id}`, error);
      },
    });
  }
}
