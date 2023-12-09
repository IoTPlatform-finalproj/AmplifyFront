import baseAxios from "../config/AxiosConfig";
import {useEffect, useState} from "react";

function MySensor({jwtToken, updateState, updateSignal}) {

    const [sensors, setSensors] = useState([])
    useEffect(() => {
        getSensors(jwtToken)
    }, [jwtToken, updateState])
    const getSensors = async (token) => {
        if(token === '') return
        try {
            const response = await baseAxios.get(
                "sensors",
                {
                    headers: {
                        Authorization: token
                    }
                });
            setSensors(response.data.sensors)

            console.log('API response:', response.data);
        } catch (error) {
            console.log()
            console.error('Error calling API:', error);
        }
    };

    return (
        <div>
            <h3>My Sensors:{sensors.length}</h3>
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
                {sensors.map((sensor) => (
                    <tr key={sensor.id}>
                        <td>{sensor.id}</td>
                        <td>{sensor.name}</td>
                        <td>{sensor.description}</td>
                        <td>{sensor.type}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MySensor