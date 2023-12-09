import {useEffect, useState} from "react";
import baseAxios from "../../config/AxiosConfig";

function RuleAdd({token, updateSignal, closeWin, deviceList, sensorList, ruleList}) {
    const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0)
    const [selectedSensorIndex, setSelectedSensorIndex] = useState(0)
    const [ruleType, setRuleType] = useState(0)

    const [isOn, setIsOn] = useState(false)
    const [sensorVal, setSensorVal] = useState(0)

    const [isActive, setIsActive] = useState(false)
    const [step, setStep] = useState(0)
    const [useIsActive, setUseIsActive] = useState(true)
    const [useStep, setUseStep] = useState(true)

    const [deviceType, setDeviceType] = useState(0)
    const [sensorType, setSensorType] = useState(0)

    useEffect(() => {
        (async () => {
            if (deviceList.length === 0) {
                setDeviceType(-1)
                return
            }
            setDeviceType((await getDeviceType(deviceList[selectedDeviceIndex].id)))
            console.log(`device: ${deviceType}`)
        })()
    }, [deviceList, selectedDeviceIndex, token]);

    useEffect(() => {
        (async () => {
            if (sensorList.length === 0) {
                setSensorType(-1)
                return
            }
            setSensorType(await getSensorType(sensorList[selectedSensorIndex].id))
            console.log(`sensor: ${sensorType}`)
        })()
    }, [sensorList, selectedSensorIndex, token]);
    const submit = async (event) => {
        event.preventDefault()

        const requestBody = {
            'device_id': deviceList[selectedDeviceIndex].id,
            'sensor_id': sensorList[selectedSensorIndex].id,
            'rule_type': ruleType,
            'target_value': {},
            'change_to': {}
        }

        if (deviceType === 1 && useStep) requestBody.change_to.step = step
        if (useIsActive) requestBody.change_to.is_active = isActive

        if (sensorType === 1) requestBody.target_value.value = sensorVal
        if (sensorType === 0) requestBody.target_value.is_on = isOn

        if (Object.keys(requestBody.target_value).length === 0) {
            alert('목표 센서 값이 비어 있습니다!')
            return
        }
        if (Object.keys(requestBody.change_to).length === 0) {
            alert("기기 상태 값이 비어 있습니다!")
            return
        }

        const response = await baseAxios.put(
            "auto-rules",
            requestBody,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                }
            }
        )

        if (response.status !== 200) {
            alert(`자동화 규칙 추가 실패: ${response.status}`)
            return
        }

        updateSignal()
        closeWin()
    }

    const getDeviceType = async (deviceId) => {
        const response = await baseAxios.get(
            `devices/${deviceId}`,
            {
                headers: {
                    Authorization: token
                }
            }
        )

        if (response.status !== 200) {
            alert(`기기의 정보를 가져오는 데 실패했습니다: ${response.status}`)
            return -1
        }


        return parseInt(response.data.device.type)
    }

    const getSensorType = async (sensorId) => {
        const response = await baseAxios.get(
            `sensors/${sensorId}`,
            {
                headers: {
                    Authorization: token
                }
            }
        )

        if (response.status !== 200) {
            alert(`센서의 정보를 가져오는 데 실패했습니다: ${response.status}`)
            return -1
        }

        return parseInt(response.data.sensor.type)
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    <p>기기 선택</p>
                    <table border="1">
                        <thead>
                        <tr>
                            <th>Select</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {deviceList.map((device, index) => (

                            <tr key={device.id}>
                                <td>
                                    <input
                                        type="radio"
                                        value={index}
                                        checked={selectedDeviceIndex === parseInt(index)}
                                        onChange={(e) => {
                                            setSelectedDeviceIndex((parseInt(e.target.value)))
                                        }}
                                    />
                                </td>
                                <td>{device.id}</td>
                                <td>{device.name}</td>
                                <td>{device.type}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
                <div>
                    <p>센서 선택</p>
                    <table border="1">
                        <thead>
                        <tr>
                            <th>Select</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sensorList.map((sensor, index) => (

                            <tr key={sensor.id}>
                                <td>
                                    <input
                                        type="radio"
                                        value={index}
                                        checked={selectedSensorIndex === index}
                                        onChange={(e) => {
                                            setSelectedSensorIndex((parseInt(e.target.value)))
                                        }}
                                    />
                                </td>
                                <td>{sensor.id}</td>
                                <td>{sensor.name}</td>
                                <td>{sensor.type}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>

                <div>
                    <p>연산자 선택. 좌변은 센서, 우변은 설정한 값으로 대입됩니다. 타입 2, 3은 센서 타입 1(정수 value 표현)이 아니라면 선택할 수 없습니다. </p>
                    <label>
                        Type 0: "==" (일치)
                        <input
                            type="radio"
                            value="0"
                            checked={ruleType === 0}
                            onChange={(e) => {
                                setRuleType((parseInt(e.target.value)))
                            }}
                        />
                    </label>

                    <label>
                        Type 1: "!=" (불일치)
                        <input
                            type="radio"
                            value="1"
                            checked={ruleType === 1}
                            onChange={(e) => {
                                setRuleType((parseInt(e.target.value)))
                            }}
                        />
                    </label>

                    <label>
                        Type 2: "&lt;" (초과)
                        <input
                            type="radio"
                            value="2"
                            checked={ruleType === 2}
                            onChange={(e) => {
                                setRuleType((parseInt(e.target.value)))
                            }}
                        />
                    </label>

                    <label>
                        Type 3: "&rt;" (미만)
                        <input
                            type="radio"
                            value="3"
                            checked={ruleType === 3}
                            onChange={(e) => {
                                setRuleType((parseInt(e.target.value)))
                            }}
                        />
                    </label>
                </div>
                <hr/>

                <div>
                    <p>센서</p><br/>
                    <label>
                        목표 상태(ON/OFF, Sensor type 0)
                        <input type="checkbox" checked={isOn} disabled={sensorType !== 0}
                               onChange={(e) => {
                                   setIsOn(!isOn)
                               }}/>
                    </label>
                    <label>
                        목표 상태(Value, Sensor type 1)
                        <input type="number" value={sensorVal} disabled={sensorType !== 1}
                               onChange={(e) => {
                                   setSensorVal(parseInt(e.target.value))
                               }}/>
                    </label>
                </div>

                <hr/>

                <div>
                    <div>
                        <p>기기 상태 사용 여부</p><br/>
                        <label>
                            ON/OFF 상태 사용
                            <input type="checkbox" checked={useIsActive}
                                   onChange={(e) => {
                                       setUseIsActive(!useIsActive)
                                   }}/>
                        </label>
                        <label>
                            Step 상태 사용
                            <input type="checkbox" checked={useStep} disabled={deviceType !== 1}
                                   onChange={(e) => {
                                       setUseStep(!useStep)
                                   }}/>
                        </label>
                    </div>

                    <p>기기</p><br/>
                    <label>
                        조건 만족 시 기기 상태(ON/OFF)
                        <input type="checkbox" checked={isActive} disabled={!useIsActive}
                               onChange={(e) => {
                                   setIsActive(!isActive)
                               }}/>
                    </label>
                    <label>
                        조건 만족 시 기기 상태(Step, Device type 1)
                        <input type="number" value={step} disabled={deviceType !== 1 || !useStep}
                               onChange={(e) => {
                                   setStep(parseInt(e.target.value))
                               }}/>
                    </label>
                </div>

            </form>

            <button onClick={closeWin}>cancel</button>
            <button onClick={submit}>submit</button>
        </div>
    )
}

export default RuleAdd