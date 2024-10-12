import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

interface PurchaseOrder {
  id: any;
  poId: any;
  description: string;
  totalAmount: number;
  submissionDate: string;
  status: string;
  approveStatus: string; // Add this
  userName: string; // Add this
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pendingPOs: PurchaseOrder[] = [];
  poApprovalSteps = {
    teamLeadApproved: false,
    departmentManagerApproved: false,
    financeManagerApproved: false,
  };

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.getCurrentUserId(); // Replace with actual logic to get the current user's ID

    this.fetchPendingApprovals(userId);
  }

  getCurrentUserId(): any {
    const userId = this.auth.getCurrentUserId();

    return userId;
  }

  fetchPendingApprovals(userId: number): void {
    this.api.fetchPendingApprovals(userId).subscribe((response: any) => {
      if (response.success && response.data) {
        console.log('resp', response.data);
        this.pendingPOs = response.data
          .filter((item: any) => item.status === 'Pending')
          .map((item: any) => ({
            id: item.id,
            poId: item.purchaseOrder.id,
            description: `Approval Level ${item.approvalLevel}`,
            approveStatus: item.approvalLevel,
            totalAmount: item.purchaseOrder.totalAmount,
            userName: item.user.username,
            status: item.status,
          }));
        this.setApprovalSteps(response.data);
      }
    });
  }

  setApprovalSteps(data: any[]): void {
    const teamLeadApproval = data.find((d) => d.user.roleName === 'Team Lead');
    const departmentManagerApproval = data.find(
      (d) => d.user.roleName === 'Department Manager'
    );
    const financeManagerApproval = data.find(
      (d) => d.user.roleName === 'Finance Manager'
    );

    this.poApprovalSteps.teamLeadApproved =
      teamLeadApproval?.status === 'Approved';
    this.poApprovalSteps.departmentManagerApproved =
      departmentManagerApproval?.status === 'Approved';
    this.poApprovalSteps.financeManagerApproved =
      financeManagerApproval?.status === 'Approved';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Pending':
        return 'pending';
      default:
        return '';
    }
  }

  approvePO(po: PurchaseOrder): void {
    console.log('po', po.poId);
    this.api.approveWorkflow(po.id).subscribe({
      next: (response) => {
        console.log('Workflow :', response);
        if (response.responseStatus == 'Success') {
          const userId = response.data.user.id;
          this.fetchPendingApprovals(userId);
        }
      },
      error: (error) => console.error('Error rejecting PO:', error),
    });
  }

  rejectPO(po: PurchaseOrder): void {
    this.api.rejectWorkflow(po.id).subscribe({
      next: (response) => {
        if (response.responseStatus == 'Success') {
          const userId = response.data.user.id;
          this.fetchPendingApprovals(userId);
        }
        console.log('Workflow rejected:', response);
      },
      error: (error) => console.error('Error rejecting PO:', error),
    });
    po.status = 'Rejected';
  }
}
