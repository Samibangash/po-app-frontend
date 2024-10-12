import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  purchaseOrders: any[] = [];
  currentUserRole: number | null = null;

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
            status: this.getCurrentStatus(
              po.approvalWorkflows ?? [],
              po.status
            ),
            adminStatus: po.status,
            approvalWorkflows: (po.approvalWorkflows ?? []).map(
              (workflow: any) => ({
                roleName: workflow.user?.role
                  ? this.getRoleName(workflow.user.role)
                  : 'Unknown', // Defensive check here
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
    let pendingWorkflow = null;
    let isRejected = false;

    // Sort the workflows by approval level to process them in the correct order
    approvalWorkflows.sort((a, b) => a.approvalLevel - b.approvalLevel);

    // Loop through the workflows to find pending or rejected status
    approvalWorkflows.some((workflow) => {
      console.log(workflow);

      // If any workflow is rejected, return early
      if (workflow.status === 'Rejected') {
        isRejected = true;
        return true; // stop further iterations if rejected is found
      }

      // Find the first pending workflow
      if (workflow.status === 'Pending') {
        pendingWorkflow = workflow.approvalLevel;
        return true;
      }
      return false;
    });

    // If any approval is rejected, return 'Rejected'
    if (isRejected) {
      return 'Rejected';
    }

    // If there is a pending workflow, return the appropriate message
    if (pendingWorkflow) {
      const level = pendingWorkflow;
      return `Pending Level ${level} Approval`;
    }

    // If all approvals are done, return 'All Approve'
    return 'All Approve';
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
