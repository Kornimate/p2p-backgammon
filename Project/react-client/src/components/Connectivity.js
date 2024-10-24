import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr'
import { IdSeparator } from '../constants/Constants';

const Connectivity = () => {

    const [connection, setConnection] = useState(null);
    const [id, setId] = useState('');

    useEffect(() => {
        
        let signalRConn = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:8080/matchMaking",{
            withCredentials:false
        })
        .build();

        setConnection(signalRConn);
            
        },[]);

        useEffect(() => {
            if(connection){
                connection.on("SendMessage", data => {
                    console.log(`Sent: ${data}`);
                });
        
                connection.on("GetId", data => {
                    setId(data);
                    console.log(`Id assigned: ${data}`);
                    connection.invoke("PublishUserData", `${data}${IdSeparator}${0}`)
                });
        
                connection.on("RecieveMessage", data => {
                    console.log(`Recieved: ${data}`);
                });

                connection.on("StartGame", data =>{
                    console.log(`Starting game with: ${data}`);
                    connection.stop();
                });
        
                connection.start()
                    .then(() => {
                        console.log("connection established")
                    });
            }
        },[connection])

    return <div>
        {id}
    </div>
}

export default Connectivity;