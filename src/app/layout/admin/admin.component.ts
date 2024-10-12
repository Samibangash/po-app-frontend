import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

const ROLE_MAP: { [key: number]: string } = {
  2: 'Team Lead',
  3: 'Department Manager',
  4: 'Finance Manager',
};

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  purchaseOrders: any[] = [];
  teamLeadUsers: any[] = [];
  departmentManagerUsers: any[] = [];
  financeManagerUsers: any[] = [];

  selectedTeamLead: string = '';
  selectedDepartmentManager: string = '';
  selectedFinanceManager: string = '';
  currentPoId: number | null = null; // This will store the poId for the current workflow

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchPurchaseOrders();
    this.loadUsersByRole();
  }

  // Load users by their role
  loadUsersByRole() {
    this.userService.getUsersByRole(2).subscribe((users) => {
      this.teamLeadUsers = users;
    });
    this.userService.getUsersByRole(3).subscribe((users) => {
      this.departmentManagerUsers = users;
    });
    this.userService.getUsersByRole(4).subscribe((users) => {
      this.financeManagerUsers = users;
    });
  }

  // Fetch purchase orders from the API
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

  // Determine the current status based on the approval workflows
  getCurrentStatus(approvalWorkflows: any[], status: any): string {
    let pendingWorkflow = null;
    approvalWorkflows.sort((a, b) => a.approvalLevel - b.approvalLevel);

    approvalWorkflows.some((workflow) => {
      console.log(workflow);

      if (workflow.status === 'Pending') {
        pendingWorkflow = workflow.approvalLevel;
        return true;
      }
      return false;
    });

    if (pendingWorkflow) {
      const level = pendingWorkflow;
      return `Pending Level ${level} Approval`;
    }
    return 'Pending';
  }

  // Map role ID to role name
  getRoleName(roleId: any): string {
    return ROLE_MAP[roleId] || 'Unknown Role';
  }

  // Approve a purchase order
  approvePO(poNumber: string): void {
    this.apiService.approvePurchaseOrder(poNumber).subscribe({
      next: (response) => {
        console.log('PO approved:', response);
        this.fetchPurchaseOrders(); // Refresh list after approval
      },
      error: (error) => console.error('Error approving PO:', error),
    });
  }

  // Reject a purchase order
  rejectPO(poNumber: string): void {
    this.apiService.rejectPurchaseOrder(poNumber).subscribe({
      next: (response) => {
        console.log('PO rejected:', response);
        this.fetchPurchaseOrders(); // Refresh list after rejection
      },
      error: (error) => console.error('Error rejecting PO:', error),
    });
  }

  // View the approval workflow for a specific PO and open the modal
  viewApprovalWorkflow(poId: number, content: any): void {
    this.currentPoId = poId;
    this.apiService.getApprovalWorkflow(poId).subscribe({
      next: (response) => {
        const workflow = response.data.approvalWorkflows; // Access the array inside the response
        console.log('Workflow data:', workflow);

        if (Array.isArray(workflow)) {
          const level1 = workflow.find((w: any) => w.approvalLevel === 1);
          const level2 = workflow.find((w: any) => w.approvalLevel === 2);
          const level3 = workflow.find((w: any) => w.approvalLevel === 3);

          // Access the userId from the nested user object
          this.selectedTeamLead = level1?.user?.id || '';
          this.selectedDepartmentManager = level2?.user?.id || '';
          this.selectedFinanceManager = level3?.user?.id || '';
        } else {
          console.error('Workflow is not an array:', workflow);
        }

        this.openWorkflowModal(content); // Open the modal and display workflow details
      },
      error: (error) => console.error('Error fetching workflow:', error),
    });
  }

  // Open the workflow modal
  openWorkflowModal(content: any) {
    this.modalService.open(content, { size: 'lg' }).result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed: ${reason}`);
      }
    );
  }

  // Close the workflow modal
  closeWorkflowModal() {
    this.modalService.dismissAll();
  }

  // Submit the approval workflow
  submitWorkflow(): void {
    if (this.currentPoId === null) {
      console.error('No purchase order selected');
      return;
    }

    const workflows = [
      { userId: this.selectedTeamLead, approvalLevel: 1 },
      { userId: this.selectedDepartmentManager, approvalLevel: 2 },
      { userId: this.selectedFinanceManager, approvalLevel: 3 },
    ];

    // Loop through the workflows and create the approval workflow for each level
    workflows.forEach((workflow) => {
      if (workflow.userId) {
        // API endpoint to create approval workflow
        const apiUrl = `http://localhost:8080/api/workflow/create?poId=${this.currentPoId}&userId=${workflow.userId}&approvalLevel=${workflow.approvalLevel}`;

        // Call the API to create the workflow
        this.apiService.createApprovalWorkflow(apiUrl).subscribe({
          next: (response) => {
            if (response.responseStatus === 'Success') {
              console.log(
                `Approval level ${workflow.approvalLevel} saved successfully.`
              );
            }
          },
          error: (error) => {
            console.error(
              `Error creating workflow for approval level ${workflow.approvalLevel}:`,
              error
            );
          },
        });
      }
    });

    // Close the modal after submission
    this.closeWorkflowModal();
  }
}
