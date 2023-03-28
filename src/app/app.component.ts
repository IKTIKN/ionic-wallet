import { Component } from '@angular/core';
import { WalletService } from './services/wallet/wallet.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
})
export class AppComponent {

	constructor(public wallet: WalletService) {
		this.wallet.initWallet();
	}
}
