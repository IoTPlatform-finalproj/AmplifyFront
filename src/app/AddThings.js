import {useState} from "react";
import Modal from "../component/Modal";
import DeviceAdd from "./device/DeviceAdd";
import SensorAdd from "./sensor/SensorAdd";
import RuleAdd from "./rules/RuleAdd";
import "./AddThings.css"

function AddThings({jwtToken, updateState, updateSignal, deviceList, sensorList, ruleList}) {
    const [isDeviceAddOpen, setIsDeviceAddOpen] = useState(false)
    const [isSensorAddOpen, setIsSensorAddOpen] = useState(false)
    const [isRuleAddOpen, setIsRuleAddOpen] = useState(false)


    return (
        <div>
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
            {isRuleAddOpen && <Modal onClose={() => {
                setIsRuleAddOpen(false)
            }}>
                <RuleAdd token={jwtToken} updateSignal={updateSignal} closeWin={() => {
                    setIsRuleAddOpen(false)
                }} deviceList={deviceList} sensorList={sensorList} ruleList={ruleList}></RuleAdd>
            </Modal>}
            <button onClick={() => {
                setIsDeviceAddOpen(true)
            }}>기기 추가
            </button>
            <button onClick={() => {
                setIsSensorAddOpen(true)
            }}>센서 추가
            </button>
            <button onClick={() => {
                setIsRuleAddOpen(true)
            }}>자동화 규칙 추가
            </button>
        </div>
    )
}

export default AddThings