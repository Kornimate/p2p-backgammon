import Peer from 'peerjs';
import crypto from 'crypto';

let hash = null;
let randomNum = null;
let nonce = null;
let opponentHash = null;
let opponentRandomNum = null;
let diceResult = null;
let peer = null;
let connection = null;
let peerId = '';

export const initializePeer = () => {
    return new Promise((resolve, reject) => {
        peer = new Peer();
        peer.on('open', (id) => {
            peerId = id;
            resolve(peerId);
        });
        peer.on('connection', (conn) => {
            connection = conn;
            connection.on('data', handleData);
        });
        peer.on('error', reject);
    });
};

export const connectToPeer = (opponentId) => {
    return new Promise((resolve, reject) => {
        if (!peer) {
            reject(new Error('Peer not initialized.'));
            return;
        }

        connection = peer.connect(opponentId);
        connection.on('open', () => {
            connection.on('data', handleData);
            resolve();
        });
        connection.on('error', reject);
    });
};

export const startProtocol = () => {
    randomNum = Math.floor(Math.random() * 6); //uniformly random
    nonce = crypto.randomBytes(16).toString('hex');
    hash = crypto.createHash('sha256').update(randomNum + nonce).digest('hex');

    if(connection) {
        connection.send({type: 'hash', hash: hash});
    }

    return { randomNum, nonce, hash };
};

export const revealSecret = () => {
    if(hash && opponentHash && connection) {
        connection.send({
            type: 'reveal',
            randomNum: randomNum.toString(),
            nonce: nonce
        });
    }
};

export const handleData = (data) => {
    if(data.type === 'hash') {
        opponentHash = data.hash;
    }
    else if(data.type === 'reveal') {
        opponentRandomNum = {
            randomNum: data.randomNum, 
            nonce: data.nonce
        };
    }
};

export const verifyAndRollDice = () => {
    if (!opponentHash || !opponentRandomNum) {
        throw new Error('Missing Data');
    }
    const { randomNum: opponentRandomNum, nonce: opponentNonce } = opponentRandomNum;
    const verifyHash = crypto.createHash('sha256').update(opponentRandomNum + opponentNonce).digest('hex');

    if(verifyHash !== opponentHash) {
        throw new Error('Potential cheating detected');
    }
    diceResult = ((randomNum + opponentRandomNum) % 6) + 1;
    return {diceResult};
}