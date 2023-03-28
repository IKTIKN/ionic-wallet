import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/services/wallet/wallet.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {

  constructor(public wallet: WalletService) { }

  ngOnInit() {
  }

}
