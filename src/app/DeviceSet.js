import baseAxios from "../config/AxiosConfig";
import {useState} from "react";

function DeviceSet({deviceId, deviceType, token, updateSignal, closeWin}) {
    const [isActive, setActive] = useState(false);
    const [step, setStep] = useState(0);

    const setDevice = async () => {
        if (token === '') return

        const statusTo = {
            'is_active': isActive
        }
        console.log(`type=${typeof deviceType}`)
        if (deviceType === 1)
            statusTo.step = step


        try {
            const response = await baseAxios.put(
                `devices/${deviceId}`,
                {
                    'status_to': statusTo
                },
                {
                    headers: {
                        Authorization: token,
                    }
                }
            )
            if (response.status === 200) {
                updateSignal()
                closeWin()
            } else {
                alert(`Error: ${response.status}`)
                console.error(response.data)
            }
        } catch (e) {
            alert(`Error while calling api`)
            console.error(e)
        }
    }

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => {
                        setActive(!isActive)
                    }}
                />
                ON/OFF
            </label>

            <br/>

            <label>
                Step:
                <input
                    type="number"
                    value={step}
                    onChange={(e) => {
                        setStep(parseInt(e.target.value))
                    }}
                />
            </label>

            <br/>

            <button onClick={closeWin}>cancel</button>
            <button onClick={setDevice}>submit</button>
        </div>
    );
}

export default DeviceSet