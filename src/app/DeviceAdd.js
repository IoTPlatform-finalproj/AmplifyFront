import {useState} from "react";
import baseAxios from "../config/AxiosConfig";

function DeviceAdd({token, updateSignal, closeWin}) {
    const [name, setName] = useState('')
    const [type, setType] = useState(0)
    const [description, setDescription] = useState('')
    const [power, setPower] = useState(0)

    const [isSuccessed, setIsSuccessed] = useState(null)

    const submit = async (event) => {
        event.preventDefault();

        const requestBody = {
            'device_type': type,
            'device_name': name,
            'device_description': description,
            'device_power': power
        }
        console.log(requestBody)

        const response = await baseAxios.put(
            'devices',
            requestBody,
            {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                }
            }
        )

        if (response.status !== 200) {
            alert(`등록 실패! 응답 코드: ${response.status}`)
            return
        }

        updateSignal()
        setIsSuccessed(response.data)


    };


    return (
        <div>
            <form onSubmit={submit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </label>
                <br/>

                <label>
                    Description:
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </label>
                <br/>

                <label>
                    소비전력(W):
                    <input
                        type="number"
                        value={power}
                        onChange={(e) => setPower(parseInt(e.target.value))}
                    />
                </label>
                <br/>

                <div>
                    <p>타입 0은 on/off를 가지는 제품, 1은 0에 더해 단계 (ex: 에어컨)를 가지는 제품입니다. </p>
                    <label>
                        Type 0
                        <input
                            type="radio"
                            value="0"
                            checked={type === 0}
                            onChange={(e) => {
                                setType((parseInt(e.target.value)))
                            }}
                        />
                    </label>

                    <label>
                        Type 1
                        <input
                            type="radio"
                            value="1"
                            checked={type === 1}
                            onChange={(e) => {
                                setType((parseInt(e.target.value)))
                            }}
                        />
                    </label>
                </div>

                <button type="submit">Submit</button>
            </form>
            {isSuccessed !== null && <div>
                <strong>기기 인증 정보: 반드시 안전하게 저장!</strong><br/>
                <span>기기 ID: </span> <p>{isSuccessed.device_id}</p><br/>
                <span>기기 인증서: </span><p>{isSuccessed.certificatePem}</p><br/>
                <span>개인키: </span><p>{isSuccessed.privateKey}</p><br/>
                <span>공개키: </span><p>{isSuccessed.publicKey}</p><br/>
            </div>}
            <button onClick={closeWin}>닫기</button>
        </div>
    );
}

export default DeviceAdd