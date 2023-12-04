import baseAxios from "../config/AxiosConfig";
import {useEffect, useState} from "react";

function MyDevice({jwtToken, updateState, updateSignal}) {

    const [devices, setDevices] = useState([])
    useEffect(() => {
        getDevices(jwtToken)
    }, [jwtToken, updateState])
    const getDevices = async (token) => {
        if(token === '') return
        try {
            const response = await baseAxios.get(
                "devices",
                {
                    headers: {
                        Authorization: token
                    }
                });
            setDevices(response.data.devices)

            console.log('API response:', response.data);
        } catch (error) {
            console.log()
            console.error('Error calling API:', error);
        }
    };

    return (
        <div>
            <h3>My Devices</h3>
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                </tr>
                </thead>
                <tbody>
                {devices.map((device) => (
                    <tr key={device.id}>
                        <td>{device.id}</td>
                        <td>{device.name}</td>
                        <td>{device.description}</td>
                        <td>{device.type}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyDevice