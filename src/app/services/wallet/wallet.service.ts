import { Injectable } from '@angular/core';
import { AddressResponse, Balance, MultiAddressResponse, Tx } from 'src/app/interfaces/ResponseInterfaces';
import { BitcoinService } from '../bitcoin/bitcoin.service';
import { BlockExplorerService, Transaction } from '../block-explorer/block-explorer.service';

export interface Wallet {
    addressType: string;
    keyPair: KeyPair;
    balance: number;
    received: number;
    sent: number;
    transactions: number;
}

export interface KeyPair {
    address: string;
    wif: string;
}

@Injectable({
    providedIn: 'root'
})
export class WalletService {

    initialized = false;

    wallet!: Wallet[];
    tx!: Tx[];
    balance!: Balance;
    multi!: MultiAddressResponse;

    constructor(
        private bitcoin: BitcoinService,
        private block: BlockExplorerService
    ) {

    }

    initWallet(): void {
        this.initBip32Wallet('praise you muffin lion enable neck grocery crumble super myself license ghost')
        console.log(this.wallet)

    }

    private initBip32Wallet(mnemonic: string): void  {
        this.wallet = this.bitcoin.generateBip32Wallet(mnemonic);
        this.block.getMultiAddress(this.wallet).subscribe((balance) => {
            this.multi = balance;
            this.tx = balance.txs;
            this.balance = balance.wallet;
            this.addWalletData(balance.addresses);
            this.initialized = true;
        });
    }

    private addWalletData(addresses: AddressResponse[]): void {
        addresses.forEach((address) => {
            const i = this.wallet.findIndex(e => e.keyPair.address == address.address)
            this.wallet[i].balance = address.final_balance;
            this.wallet[i].transactions = address.n_tx;
            this.wallet[i].sent = address.total_sent;
            this.wallet[i].received = address.total_received;
        });
    }
}
