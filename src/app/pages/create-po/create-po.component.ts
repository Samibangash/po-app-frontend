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
  createPoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.createPoForm = this.fb.group({
      description: ['', Validators.required],
      totalAmount: [{ value: 0 }],
      items: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addItem(); // Add initial item row
    this.items.valueChanges.subscribe(() => this.updateTotalAmount());
  }

  // Getter for the items form array
  get items(): FormArray {
    return this.createPoForm.get('items') as FormArray;
  }

  // Method to create a new item form group
  newItem(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // Method to add a new item to the items form array
  addItem(): void {
    this.items.push(this.newItem());
  }

  // Method to remove an item from the items form array
  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateTotalAmount(); // Recalculate total when an item is removed
  }

  // Method to calculate the total amount based on quantity and price of each item
  updateTotalAmount(): void {
    const total = this.items.controls.reduce((sum, control) => {
      const quantity = control.get('quantity')?.value || 0;
      const price = control.get('price')?.value || 0;
      return sum + quantity * price;
    }, 0);

    // Update the totalAmount control
    this.createPoForm.get('totalAmount')?.setValue(total);
  }

  onSubmit(): void {
    if (this.createPoForm.valid) {
      console.log(this.createPoForm.value);
      this.api.createPo(this.createPoForm.value).subscribe(
        (response) => {
          if (response.success) {
            console.log('PO created successfully', response);
            this.router.navigate(['/user-layout']);
          }
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
