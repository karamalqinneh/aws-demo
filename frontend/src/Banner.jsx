import {useEffect, useState} from "react";

const Banner = ({socket}) => {
    const [file, setFile] = useState(null);

    useEffect(() => {

        socket.on("success", (payload) => {
            setFile(payload.message);
        });
    }, [socket]);

    return file ? <div style={{
        width: "100vw",
        height: "5vh",
        backgroundColor: "green",
        color: "ghostwhite",
        position: "absolute",
        top: "0",
        left: "0"
    }}>{`You have successfully uploaded ${file}`}</div> : null;
}


export default Banner;