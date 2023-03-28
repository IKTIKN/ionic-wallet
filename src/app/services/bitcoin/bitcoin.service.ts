import { Injectable } from '@angular/core';
import * as bitcoin from 'bitcoinjs-lib';
import { Network } from 'bitcoinjs-lib';
import { ECPairFactory, ECPairInterface } from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import { BIP32Factory, BIP32Interface } from 'bip32';
import { KeyPair, Wallet } from '../wallet/wallet.service';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);



@Injectable({
    providedIn: 'root'
})
export class BitcoinService {

    constructor() { }

    private getAddress(
        publicKey: Buffer, 
        network: Network = bitcoin.networks.bitcoin, 
        segwit: Boolean = false
    ): string {
        return segwit ?
            bitcoin.payments.p2wpkh({ pubkey: publicKey, network: network }).address! :
            bitcoin.payments.p2pkh({ pubkey: publicKey, network: network }).address!
    }


    private deriveKeyPair(
        root: BIP32Interface, 
        path: string, 
        addressPath: number
    ): KeyPair {
        path = path.concat(addressPath.toString());
        const privKey = root.derivePath(path).privateKey!;
        const ecPair = ECPair.fromPrivateKey(privKey);
        return this.generateKeyPairFromEcPair(ecPair);
    }


    private async generateSHA265HashBuffer(input: string): Promise<Buffer> {
        const textAsBuffer = new TextEncoder().encode(input);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
        const buffer = Buffer.from(hashBuffer);
        return buffer;
    }


    private generateKeyPairFromEcPair(
        ecPair: ECPairInterface,
        segwit: boolean = false,
        network: Network = bitcoin.networks.bitcoin
    ): KeyPair {
        const publicKey = ecPair.publicKey;
        const address = this.getAddress(publicKey, network, segwit);

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


    generateKeyPairFromBuffer(
        buffer: Buffer, 
        segwit: boolean = false, 
        compressed: boolean = false
    ): KeyPair {
        const options = { compressed: compressed };
        const ecPair = ECPair.fromPrivateKey(buffer, options);
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


    generateBip32Wallet(
        mnemonic?: string, 
        totalAddresses: number = 20
    ): Wallet[] {
        let wallet: Wallet[] = [];
        mnemonic = mnemonic ?? this.generateMnemonic();

        const seed = this.generateSeedFromMnemonic(mnemonic);
        const root = bip32.fromSeed(seed);

        for (let x=0; x<totalAddresses; x++) {
            wallet.push(this.setWallet("receiving", this.deriveKeyPair(root, "m/0'/0/", x)));
        }

        for (let x=0; x<10; x++) {
            wallet.push(this.setWallet("change", this.deriveKeyPair(root, "m/0'/1/", x)));
        }

        return wallet;
    }

    
    private setWallet(type: string, pair: KeyPair): Wallet {
        return {
            addressType: type,
            keyPair: pair,
            balance: 0,
            received: 0,
            sent: 0,
            transactions: 0
        }
    }


    generateMnemonic(): string {
        return bip39.generateMnemonic();
    }


    generateSeedFromMnemonic(mnemonic: string): Buffer {
        return bip39.mnemonicToSeedSync(mnemonic);
    }

}
