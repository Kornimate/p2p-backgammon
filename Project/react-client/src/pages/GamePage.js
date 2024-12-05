import GameBoard from "../components/GameBoard"
import * as signalR from '@microsoft/signalr'
import { IdSeparator, NameSeparator } from '../constants/Constants';
import { useState, useEffect, useRef } from "react";
import { GetPlayerGames, GetToken } from '../shared-resources/StorageHandler';
import Peer from "peerjs";
import { GetPlayerName } from "../shared-resources/StorageHandler";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/GamePage.css"

const GamePage = () => {

    const [connectionSignalR, setConnectionSignalR] = useState(null);
    const [connectionToWrite, setConnectionToWrite] = useState(null);
    const [connectionToListen, setConnectionToListen] = useState(null);
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

            setConnectionToListen(conn);
        });


        peer.on("error", (err) => {
            console.error("PeerJS error:", err);
            alert("Error in connection, navigating back to home page.")
            navigate("/game");
        });

        return () => {
            peer.destroy();
        };

    }, []);

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
                const opponentData = JSON.parse(data);
                console.log(opponentData)
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
        
        const conn = peerInstance.current.connect(opponent.PeerId);
        
        conn.on('open', () => {
            console.log('Connected to:', opponent[0]);
            setConnectionToWrite(conn);
        });
      
        conn.on("error", (err) => {
            console.error("PeerJS connection error:", err);
        });
    
        conn.on("close", () => {
            console.log("Connection closed with opponent.");
            setConnectionToWrite(null);
        });

        return () => {
            if (conn) conn.close();
        };


    }, [opponent])

    return (
        <div>
            {
                connectionToWrite === null || connectionToListen === null?
                <div className="container">
                    <CircularProgress />
                </div> :
                <GameBoard write={connectionToWrite} listen={connectionToListen} opponentName={opponent.Name} isBlack={opponent.IsBlack}/>
            }
        </div>
    )
}
export default GamePage;