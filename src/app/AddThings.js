import {useState} from "react";
import Modal from "../component/Modal";
import DeviceAdd from "./device/DeviceAdd";
import SensorAdd from "./sensor/SensorAdd";

function AddThings({jwtToken, updateState, updateSignal}) {
    const [isDeviceAddOpen, setIsDeviceAddOpen] = useState(false)
    const [isSensorAddOpen, setIsSensorAddOpen] = useState(false)


    return (
        <div>
            <hr/>
            {isDeviceAddOpen && <Modal onClose={() => {
                setIsDeviceAddOpen(false)
            }}>
                <DeviceAdd token={jwtToken} updateSignal={updateSignal} closeWin={() => {
                    setIsDeviceAddOpen(false)
                }}/>
            </Modal>}
            {isSensorAddOpen && <Modal onClose={() => {
                setIsSensorAddOpen(false)
            }}>
                <SensorAdd token={jwtToken} updateSignal={updateSignal} closeWin={() => {
                    setIsSensorAddOpen(false)
                }}/>
            </Modal>}
            <button onClick={() => {
                setIsDeviceAddOpen(true)
            }}>기기 추가
            </button>
            <button onClick={() => {
                setIsSensorAddOpen(true)
            }}>센서 추가
            </button>
        </div>
    )
}

export default AddThings