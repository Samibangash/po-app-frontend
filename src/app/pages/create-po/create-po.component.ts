import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-create-po',
  templateUrl: './create-po.component.html',
  styleUrls: ['./create-po.component.scss'],
})
export class CreatePoComponent implements OnInit {
  createPoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.addItem(); // Automatically add one item on form load
  }

  // Create form with dynamic items array
  createForm() {
    this.createPoForm = this.fb.group({
      description: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      items: this.fb.array([]), // Array to store multiple items
    });
  }

  // Get items array as a FormArray
  get items(): FormArray {
    return this.createPoForm.get('items') as FormArray;
  }

  // Add a new item to the items array
  addItem() {
    const itemForm = this.fb.group({
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.items.push(itemForm);
  }

  // Remove an item from the items array
  removeItem(index: number) {
    this.items.removeAt(index);
  }

  // Submit the form
  onSubmit() {
    if (this.createPoForm.valid) {
      console.log(this.createPoForm.value);
      this.api.createPo(this.createPoForm.value).subscribe(
        (response) => {
          console.log('PO created successfully', response);
          this.router.navigate(['/po-list']); // Navigate to the PO list or dashboard
        },
        (error) => {
          console.error('Error creating PO', error);
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }
}
