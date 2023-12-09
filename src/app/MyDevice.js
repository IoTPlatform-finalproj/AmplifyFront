import baseAxios from "../config/AxiosConfig";
import {useEffect, useState} from "react";
import DeviceLog from "./device/DeviceLog";
import Modal from "../component/Modal";
import DeviceSet from "./device/DeviceSet";

function MyDevice({jwtToken, updateState, updateSignal}) {

    const [devices, setDevices] = useState([])
    const [logs, updateLogs] = useState([])
    const [selectedDevice, setSelectedDevice] = useState([null, null, null])
    const [isDeviceWinOpen, setDeviceWin] = useState(false);
    const [isDeviceAddWinOpen, setDeviceAddWin] = useState(false)


    useEffect(() => {
        getDevices(jwtToken)
    }, [jwtToken, updateState])

    const getDevices = async (token) => {
        if (token === '') return
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

    const getDeviceLog = async (token, deviceId) => {
        if (token === '') return
        try {
            const response = await baseAxios.get(
                `devices/${deviceId}/log`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            )

            updateLogs(response.data.device_log)

            console.log('Device log: ', response.data.device_log)
        } catch (error) {
            console.error('Error while fetch log: ', error)
        }
    }

    return (
        <div>
            <h3>My Devices: {devices.length}</h3>
            <table border="1">
                <thead>
                <tr>
                    <th>State</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Power(W)</th>
                    <th>Log</th>
                    <th>Control Panel</th>
                </tr>
                </thead>
                <tbody>
                {devices.map((device) => (
                    <tr key={device.id}>
                        <td>{`${device.status.is_active ? "ON" : "OFF"}${device.status.step === undefined ? "" : ", " + device.status.step}`}</td>
                        <td>{device.id}</td>
                        <td>{device.name}</td>
                        <td>{device.description}</td>
                        <td>{device.type}</td>
                        <td>{device.power}</td>
                        <td>
                            <button onClick={() => {
                                if (selectedDevice[1] === device.id) {
                                    setSelectedDevice(null)
                                } else {
                                    updateLogs([])
                                    setSelectedDevice([device.name, device.id, parseInt(device.type)])
                                    getDeviceLog(jwtToken, device.id)
                                }
                            }}>check
                            </button>
                        </td>
                        <td>
                            <button onClick={() => {
                                setSelectedDevice([device.name, device.id, parseInt(device.type)])
                                setDeviceWin(true)

                            }}>open
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isDeviceWinOpen && <Modal onClose={() => {
                setDeviceWin(false)
            }}>
                <DeviceSet updateSignal={updateSignal} deviceId={selectedDevice[1]} deviceType={selectedDevice[2]}
                           token={jwtToken} closeWin={() => {
                    setDeviceWin(false)
                }}/>
            </Modal>}
            {selectedDevice !== null && <DeviceLog name={selectedDevice[0]} logList={logs}/>}

            {isDeviceAddWinOpen && <Modal onClose={() => {
                setDeviceAddWin(false)
            }}></Modal>}
        </div>
    );
}

export default MyDevice