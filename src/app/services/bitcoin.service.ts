import { Injectable } from '@angular/core';
import * as bitcoin from 'bitcoinjs-lib';
import { Network } from 'bitcoinjs-lib';
import ECPairFactory, { ECPairInterface } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

export interface KeyPair {
    address: string;
    wif: string;
}

@Injectable({
    providedIn: 'root'
})
export class BitcoinService {


    constructor() {
        this.generateBrainWallet("password");
    }


    async generateSHA265HashBuffer(input: string): Promise<Buffer> {
        const textAsBuffer = new TextEncoder().encode(input);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
        const buffer = Buffer.from(hashBuffer);
        return buffer;
    }


    private generateKeyPairFromEcPair(
        ecPair: ECPairInterface,
        segwit: boolean,
        network: Network = bitcoin.networks.bitcoin
    ): KeyPair {
        const publicKey = ecPair.publicKey;
        const address = segwit ?
            bitcoin.payments.p2wpkh({ pubkey: publicKey, network: network }).address :
            bitcoin.payments.p2pkh({ pubkey: publicKey, network: network }).address

        if (address === undefined) {
            throw new Error("No address");
        }

        const keyPair: KeyPair = {
            address: address,
            wif: ecPair.toWIF()
        }

        return keyPair;
    }


    generateRandomKeyPair(
        network: Network = bitcoin.networks.bitcoin, 
        segwit: boolean = false, 
        compressed: boolean = false
    ): KeyPair {
        const options = { network: network, compressed: compressed}
        const ecPair = ECPair.makeRandom(options);
        return this.generateKeyPairFromEcPair(ecPair, segwit, network);
    }


    generateKeyPairFromWIF(
        wif: string, 
        segwit: boolean = false
    ): KeyPair {
        const ecPair = ECPair.fromWIF(wif);
        return this.generateKeyPairFromEcPair(ecPair, segwit);
    }


    generateBrainWallet(
        password: string, 
        segwit: boolean = false, 
        compressed: boolean = false
    ) {
        const options = { compressed: compressed };
        this.generateSHA265HashBuffer(password).then((hashBuffer) => {
            const ecPair = ECPair.fromPrivateKey(hashBuffer, options);
            console.log(this.generateKeyPairFromEcPair(ecPair, segwit));
        })
    }

}
