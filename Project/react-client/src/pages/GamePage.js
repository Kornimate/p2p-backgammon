import GameBoard from "../components/GameBoard"
import * as signalR from '@microsoft/signalr'
import { IdSeparator, NameSeparator } from '../constants/Constants';
import { useState, useEffect, useRef } from "react";
import { GetPlayerGames, GetToken } from '../shared-resources/StorageHandler';
import Peer from "peerjs";
import { GetPlayerName } from "../shared-resources/StorageHandler";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GamePage = () => {

    const [connectionSignalR, setConnectionSignalR] = useState(null);
    const [connectionPJS, setConnectionPJS] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [peerId, setPeerId] = useState(""); // Your custom ID
    const peerInstance = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const peer = new Peer();

        peerInstance.current = peer;

        peer.on("open", (id) => {
            console.log("My peer ID is:", id);
            setPeerId(id); // Display the custom ID
        });

        peer.on("connection", (conn) => {
            console.log("Got connection from:", conn.peer);

            conn.on("data", (data) => {
                console.log('Received:', data);
            });
        });


        peer.on("error", (err) => {
            console.error("PeerJS error:", err);
            alert("Error in connection, navigating back to home page.")
            navigate("/game");
        });

        return () => {
            peer.destroy();
        };

    });

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

        setConnectionSignalR(signalRConn);
            
        },[peerId]);

    useEffect(() => {
        if(connectionSignalR && peerId){
            connectionSignalR.on("SendMessage", data => {
                console.log(`Sent: ${data}`);
            });
    
            connectionSignalR.on("GetId", data => {
                console.log(`Id assigned from SignalR Hub: ${data}`);
                connectionSignalR.invoke("PublishUserData", `${data}${NameSeparator}${peerId}${NameSeparator}${GetPlayerName()}${IdSeparator}${GetPlayerGames()}`)
            });
    
            connectionSignalR.on("RecieveMessage", data => {
                console.log(`Recieved: ${data}`);
            });

            connectionSignalR.on("StartGame", data =>{
                console.log(`Starting game with: ${data}`);
                const opponentData = data.split(NameSeparator);
                setOpponent(opponentData);
                connectionSignalR.stop();
            });
    
            connectionSignalR
                .start()
                .then(() => {
                    console.log("connection established")
                });
        }
    },[connectionSignalR, peerId]);

    useEffect(() => {
        if(!opponent)
            return;
        
        const conn = peerInstance.current.connect(opponent[0]);

        setConnectionPJS(conn);

        conn.on('open', () => {
            console.log('Connected to:', opponent[0]);
        });
      
        conn.on("error", (err) => {
            console.error("PeerJS connection error:", err);
        });
    
        conn.on("close", () => {
            console.log("Connection closed with opponent.");
            setConnectionPJS(null);
        });
    
        setInterval(() => {
            if(conn){
                conn.send("Hello");
                console.log('Sent:', "Hello");
            }
        },5000);

        return () => {
            if (conn) conn.close();
        };


    }, [opponent])

    return (
        <div>
            {
                connectionPJS === null ?
                <CircularProgress /> :
                <GameBoard />
            }
        </div>
    )
}
export default GamePage;