import GameBoard from "../components/GameBoard"
import * as signalR from '@microsoft/signalr'
import { IdSeparator, NameSeparator } from '../constants/Constants';
import { useState, useEffect, useRef } from "react";
import { GetPlayerGames, GetToken } from '../shared-resources/StorageHandler';
import Peer from "peerjs";
import { GetPlayerName } from "../shared-resources/StorageHandler";
import { CircularProgress } from "@mui/material";

const GamePage = () => {

    const [connection, setConnection] = useState(null);
    const [connectionPJS, setConnectionPJS] = useState(null);
    const [connectedToPeer, setConnectedToPeer] = useState(false);
    const [id, setId] = useState('');
    const [opponent, setOpponent] = useState([]);
    const [peerId, setPeerId] = useState(GetPlayerName() + "#####" +(new Date()).toLocaleString()); // Your custom ID
    const peerInstance = useRef(null);

    useEffect(() => {
        const peer = new Peer(peerId);

        peerInstance.current = peer;

        peer.on("open", (id) => {
            console.log("My peer ID is:", id);
            setPeerId(id); // Display the custom ID
        });

        peer.on("connection", (conn) => {
            console.log("Connected to:", conn.peer);
            setConnectionPJS(conn);
        });

        peer.on("error", (err) => {
            console.error("PeerJS error:", err);
            //naviate back to home if error
        });

        return () => {
            peer.destroy();
            //naviate back to home if error
        };
    }, [peerId]);

    useEffect(() => {

        if(!peerId)
            return;

        let signalRConn = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:8080/matchMaking",{
            accessTokenFactory: () =>{
                return GetToken();
            }
        })
        .build();

        setConnection(signalRConn);
            
        },[peerId]);

    useEffect(() => {
        if(connection){
            connection.on("SendMessage", data => {
                console.log(`Sent: ${data}`);
            });
    
            connection.on("GetId", data => {
                setId(data);
                console.log(`Id assigned: ${data}`);
                connection.invoke("PublishUserData", `${GetPlayerName()}${NameSeparator}${peerId}${IdSeparator}${GetPlayerGames()}`)
            });
    
            connection.on("RecieveMessage", data => {
                console.log(`Recieved: ${data}`);
            });

            connection.on("StartGame", data =>{
                console.log(`Starting game with: ${data}`);
                const opponentData = data.split(NameSeparator);
                setOpponent(opponentData);
                connection.stop();
            });
    
            connection.start()
                .then(() => {
                    console.log("connection established")
                });
        }
    },[connection]);

    useEffect(() => {
        if(!opponent)
            return;
        ///connect to opponent

    }, [opponent])

    return (
        <div>
            {
                connectedToPeer == null ?
                <CircularProgress /> :
                <GameBoard />
            }
        </div>
    )
}
export default GamePage;