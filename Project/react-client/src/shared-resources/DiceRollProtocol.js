import CryptoJS from 'crypto-js';

class DiceProtocol {
    constructor() {
        this.hash = null;
        this.randomNum = null;
        this.nonce = null;
        this.opponentHash = null;
        this.opponentRandomNum = null;
    }

    getNonceAndRandomNum(){
        return {
            nonce: this.nonce,
            randomNum: this.randomNum
        };
    }

    setOpponentHash(hash){
        this.opponentHash = hash;
    }

    setOpponentNonceAndRandomNum(value){
        this.opponentNonce = value.nonce;
        this.opponentRandomNum = value.randomNum;
    }

    startProtocol() {
        this.randomNum = Math.floor(Math.random() * 6) + 1; // uniformly random
        this.nonce = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        this.hash = CryptoJS.SHA256(this.randomNum + this.nonce).toString(CryptoJS.enc.Hex);

        return this.hash;
    }

    verifyAndRollDice() {
        if (!this.opponentHash || !this.opponentRandomNum) {
            console.error("missing data in dice roll protocol")
            throw new Error('Missing Data');
        }

        const verifyHash = CryptoJS.SHA256(this.opponentRandomNum + this.opponentNonce).toString(CryptoJS.enc.Hex);

        if (verifyHash !== this.opponentHash) {
            console.error("Potential cheating detected")
            throw new Error('Potential cheating detected');
        }

        return ((this.randomNum + parseInt(this.opponentRandomNum)) % 6) + 1;
    }

    clear(){
        this.hash = null;
        this.randomNum = null;
        this.nonce = null;
        this.opponentHash = null;
        this.opponentRandomNum = null;
    }
}

export default DiceProtocol;
