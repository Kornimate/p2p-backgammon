import crypto from 'crypto-browserify';

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
        this.randomNum = Math.floor(Math.random() * 6); // uniformly random
        this.nonce = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.createHash('sha256').update(this.randomNum + this.nonce).digest('hex');

        return this.hash;
    }

    verifyAndRollDice() {
        if (!this.opponentHash || !this.opponentRandomNum) {
            console.error("missing data in dice roll protocol")
            throw new Error('Missing Data');
        }

        const verifyHash = crypto.createHash('sha256')
            .update(this.opponentRandomNum + this.opponentNonce)
            .digest('hex');

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
