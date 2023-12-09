import baseAxios from "../config/AxiosConfig";
import {useEffect, useState} from "react";
import SensorLog from "./sensor/SensorLog";

function MySensor({jwtToken, updateState, updateSignal, setSensorList}) {

    const [sensors, setSensors] = useState([])
    const [logs, updateLogs] = useState([])
    const [selectedSensor, setSelectedSensor] = useState([])

    useEffect(() => {
        getSensors(jwtToken)
    }, [jwtToken, updateState])
    const getSensors = async (token) => {
        if (token === '') return
        try {
            const response = await baseAxios.get(
                "sensors",
                {
                    headers: {
                        Authorization: token
                    }
                });
            setSensors([...response.data.sensors])
            setSensorList([...response.data.sensors])

        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    const getSensorLog = async (token, sensorId) => {
        if (token === '') return
        try {
            const response = await baseAxios.get(
                `sensors/${sensorId}/log?start_time=${new Date().getTime() - (7 * 24 * 60 * 60 * 1000)}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            )

            updateLogs(response.data.sensor_log)

        } catch (error) {
            console.error('Error while fetch log: ', error)
        }
    }

    return (
        <div>
            <h3>My Sensors:{sensors.length}</h3>
            <table border="1">
                <thead>
                <tr>
                    <th>State</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Log</th>
                </tr>
                </thead>
                <tbody>
                {sensors.map((sensor) => (
                    <tr key={sensor.id}>
                        <td>{sensor.status.is_on !== undefined ? sensor.status.is_on ? "ON" : "OFF" : sensor.status.value}</td>
                        <td>{sensor.id}</td>
                        <td>{sensor.name}</td>
                        <td>{sensor.description}</td>
                        <td>{sensor.type}</td>
                        <td>
                            <button onClick={() => {
                                if (selectedSensor.length === 3 && selectedSensor[1] === sensor.id) {
                                    setSelectedSensor([])
                                } else {
                                    updateLogs([])
                                    setSelectedSensor([sensor.name, sensor.id, parseInt(sensor.type)])
                                    getSensorLog(jwtToken, sensor.id)
                                }
                            }}>check
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedSensor.length === 3 && <SensorLog name={selectedSensor[0]} logList={logs}/>}
        </div>
    );
}

export default MySensor