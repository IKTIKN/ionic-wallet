import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { MultiAddressResponse } from 'src/app/interfaces/ResponseInterfaces';
import { Wallet } from '../bitcoin/bitcoin.service';

export interface Address {
    hash160: string;
    address: string;
    n_tx: number;
    n_unredeemed: number;
    total_received: number;
    total_sent: number;
    final_balance: number;
    txs: Transaction[];
}

export interface Transaction {
    hash: string;
    ver: number;
    vin_sz: number;
    vout_sz: number;
    lock_time: string;
    size: number;
    relayed_by: string;
    block_height: number;
    tx_index: string;
    inputs: AddressInput[];
    out: AddressOut[]
}

export interface AddressInput {
    prev_out: AddressPrevOut;
    script: string;
}

export interface AddressPrevOut {
    hash: string;
    value: string;
    tx_index: string;
    n: string;
}

export interface AddressOut {
    value: string;
    hash: string;
    script: string;
}


@Injectable({
    providedIn: 'root'
})
export class BlockExplorerService {

    private retry: number = 3;
    private baseUrl: string = "https://blockchain.info/";

    constructor(private http: HttpClient) { }

    
    getSingleAddress(address: string): Observable<Address> {
        const url = this.baseUrl.concat("rawaddr/".concat(address));
        console.log(url)
        return this.http.get<Address>(url)
            .pipe(
                retry(this.retry),
                catchError(this.handleError)
            );
    }


    getMultiAddress(wallet: Wallet[]): Observable<MultiAddressResponse> {
        const addressesUrl = this.convertToUrlString(wallet);
        const url = this.baseUrl.concat("multiaddr?active=".concat(addressesUrl));
        return this.http.get<MultiAddressResponse>(url)
            .pipe(
                retry(this.retry),
                catchError(this.handleError)
            );
    }


    private convertToUrlString(wallet: Wallet[]): string {
        let urlString = "";
        wallet.forEach((w) => {
            urlString = urlString.concat(w.keyPair.address.concat("|"));
        })
        return urlString;
    }


    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }
}
