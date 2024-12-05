import crypto from 'crypto';

class DiceProtocol {
    constructor() {
        this.hash = null;
        this.randomNum = null;
        this.nonce = null;
        this.opponentHash = null;
        this.opponentRandomNum = null;
        this.diceResult = null;
    }

    startProtocol() {
        this.randomNum = Math.floor(Math.random() * 6); // uniformly random
        this.nonce = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.createHash('sha256').update(this.randomNum + this.nonce).digest('hex');

        return { randomNum: this.randomNum, nonce: this.nonce, hash: this.hash };
    }

    revealSecret() {
        if (this.hash && this.opponentHash) {
            this.connection.send({
                type: 'reveal',
                randomNum: this.randomNum.toString(),
                nonce: this.nonce,
            }); //no good like this
        }
    }

    handleData(data) {
        if (data.type === 'hash') {
            this.opponentHash = data.hash;
        } else if (data.type === 'reveal') {
            this.opponentRandomNum = {
                randomNum: data.randomNum,
                nonce: data.nonce,
            };
        }
    }

    verifyAndRollDice() {
        if (!this.opponentHash || !this.opponentRandomNum) {
            throw new Error('Missing Data');
        }

        const { randomNum: opponentRandomNum, nonce: opponentNonce } = this.opponentRandomNum;
        const verifyHash = crypto.createHash('sha256')
            .update(opponentRandomNum + opponentNonce)
            .digest('hex');

        if (verifyHash !== this.opponentHash) {
            throw new Error('Potential cheating detected');
        }

        this.diceResult = ((this.randomNum + parseInt(opponentRandomNum)) % 6) + 1;
        return { diceResult: this.diceResult };
    }
}

export default DiceProtocol;
