import {useState} from "react";
import baseAxios from "../../config/AxiosConfig";

function SensorAdd({token, updateSignal, closeWin}) {
    const [name, setName] = useState('')
    const [type, setType] = useState(0)
    const [description, setDescription] = useState('')

    const [isSuccessed, setIsSuccessed] = useState(null)

    const submit = async (event) => {
        event.preventDefault();

        const requestBody = {
            'sensor_type': type,
            'sensor_name': name,
            'sensor_description': description,
        }
        console.log(requestBody)

        const response = await baseAxios.put(
            'sensors',
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

                <br/>

                <div>
                    <p>타입 0은 on/off의 상태 가지는 제품, 1은 단계 (ex: 온도계)를 가지는 제품입니다. </p>
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
                <strong>센서 인증 정보: 반드시 안전하게 저장!</strong><br/>
                <span>센서 ID: </span> <p>{isSuccessed.sensor_id}</p><br/>
                <span>센서 인증서: </span><p>{isSuccessed.certificatePem}</p><br/>
                <span>개인키: </span><p>{isSuccessed.privateKey}</p><br/>
                <span>공개키: </span><p>{isSuccessed.publicKey}</p><br/>
            </div>}
            <button onClick={closeWin}>닫기</button>
        </div>
    );
}

export default SensorAdd