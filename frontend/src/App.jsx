import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as axios from "axios";
import {io} from "socket.io-client";
import Banner from "./Banner.jsx";

function App() {
    const [file, setFile] = useState();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(`http://localhost:5432`);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);


    const handleUpdate = () => {
        console.log(file);
        const formData = new FormData();

        formData.append('file', file);
        axios.default.post("http://localhost:5432/api/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }

    return (
        <>
            <div>
                {socket && <Banner socket={socket} />}
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => handleUpdate()}>
                    Upload
                </button>
                <input type="file" onChange={e => setFile(e.target.files[0])}/>
                <p>
                    Upload your file
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default App
