import { Component } from '@angular/core';
import { WalletService } from 'src/app/services/wallet/wallet.service';

@Component({
  selector: 'app-transactions',
  templateUrl: 'transactions.page.html',
  styleUrls: ['transactions.page.scss']
})
export class TransactionsPage {

  constructor(public wallet: WalletService) {}

}
