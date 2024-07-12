// src/app/customer-list/customer-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CustomerTransactionService } from '../customer-transaction.service';
import { Transaction } from '../transaction';
import { Customer } from '../customer';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  transactions: Transaction[] = [];
  filteredCustomers: Customer[] = [];
  filterName: string = '';
  filterAmount: number | null = null;
  selectedCustomerId: number | null = null;
  selectedCustomerName: string | null = null;

  constructor(private customerTransactionService: CustomerTransactionService) {}

  ngOnInit(): void {
    this.customerTransactionService.getCustomers().subscribe(data => {
      this.customers = data;
      this.filteredCustomers = data;
      console.log('Customers:', this.customers);
    }, error => {
      console.error('Error fetching customers:', error);
    });

    this.customerTransactionService.getTransactions().subscribe(data => {
      this.transactions = data;
      console.log('Transactions:', this.transactions);
    }, error => {
      console.error('Error fetching transactions:', error);
    });
  }

  filterCustomers(): void {
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesName = this.filterName ? customer.name.toLowerCase().includes(this.filterName.toLowerCase()) : true;
      const matchesAmount = this.filterAmount !== null ? this.transactions.some(transaction => transaction.customer_id === customer.id && transaction.amount >= this.filterAmount!) : true;
      return matchesName && matchesAmount;
    });
  }

  getTransactionsForCustomer(customerId: number): Transaction[] {
    return this.transactions.filter(t => t.customer_id === customerId);
  }

  selectCustomer(customerId: number, customerName: string): void {
    this.selectedCustomerId = customerId;
    this.selectedCustomerName = customerName;
  }
}
