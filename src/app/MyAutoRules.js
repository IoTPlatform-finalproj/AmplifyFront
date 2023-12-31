import {useEffect, useState} from "react";
import baseAxios from "../config/AxiosConfig";

function MyAutoRules({jwtToken, updateState, updateSignal, setRuleList}) {
    const [rules, setRules] = useState([])

    useEffect(() => {
        getRules(jwtToken)
    }, [jwtToken, updateState]);

    const getRules = async (token) => {
        if (token === '') return
        try {
            const response = await baseAxios.get(
                "auto-rules",
                {
                    headers: {
                        Authorization: token
                    }
                }
            )

            if (response.status !== 200) {
                alert(`자동화 규칙 가져오기 실패: ${response.status}`)
                return
            }

            setRules(response.data.rules)
            setRuleList(response.data.rules)
        } catch (e) {
            console.error(e)
        }
    }

    const makeRuleString = (rule) => {
        let opcode = ''
        let target = ''
        let result = ''

        if (rule.target_value.is_on !== undefined) target += `STATE=${rule.target_value.is_on ? "ON" : "OFF"}`
        if (rule.target_value.value !== undefined) target += `, VALUE=${rule.target_value.value}`

        if (rule.change_to.is_active !== undefined) result += `STATE=${rule.change_to.is_active ? "ON" : "OFF"}`
        if (rule.change_to.step !== undefined) result += `, STEP=${rule.change_to.step}`

        switch (parseInt(rule.rule_type)) {
            case 0:
                opcode = '=='
                break
            case 1:
                opcode = '!='
                break
            case 2:
                opcode = '<'
                break
            case 3:
                opcode = '>'
                break
            default:
                opcode = '[err]'
                break
        }

        return `(Sensor) ${opcode} (${target}) => (Device ${result})`
    }

    const deleteRule = async (ruleId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) {
            alert("취소되었습니다.")
            return
        }

        const response = await baseAxios.delete(
            `auto-rules/${ruleId}`,
            {
                headers: {
                    Authorization: jwtToken
                }
            }
        )

        if (response.status !== 200) {
            alert(`삭제 실패: ${response.status}`)
            return
        }

        alert("삭제 성공!")
        updateSignal()
    }

    return (
        <div>
            <h3>My Auto Rules: {rules.length}</h3>
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Device ID</th>
                    <th>Sensor ID</th>
                    <th>Rule</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {rules.map((rule) => (
                    <tr key={rule.rule_id}>
                        <td>{rule.rule_id}</td>
                        <td>{rule.device_id}</td>
                        <td>{rule.sensor_id}</td>
                        <td>{makeRuleString(rule)}</td>
                        <td>
                            <button onClick={() => {
                                deleteRule(rule.rule_id)
                            }}>delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default MyAutoRules