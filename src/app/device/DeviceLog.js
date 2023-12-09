import {useEffect, useState} from "react";

function DeviceLog({name, logList, power}) {
    const [page, setPage] = useState(0);
    const logsPerPage = 10;

    const maxPage = Math.ceil(logList.length / logsPerPage);

    useEffect(() => {
        setPage(0); // 페이지 변경 시 초기화
    }, [logList]);

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, maxPage - 1));
    };

    const getPowerSum = () => {
        if (logList.length === 0) return 0

        let usedTime = 0
        let prevState = logList[0].is_active
        if (prevState === true) usedTime += (Date.now() - logList[0].timestamp)

        for (let i = 1; i < logList.length; i++) {
            if (prevState) {
                prevState = false
                continue
            }
            prevState = true
            usedTime += (logList[i - 1].timestamp - logList[i].timestamp)
        }

        return power * usedTime / (60 * 60 * 1000)
    }

    const startIndex = page * logsPerPage;
    const endIndex = startIndex + logsPerPage;

    const visibleLogs = logList.slice(startIndex, endIndex);

    return (
        <div>
            <h3>{`Log: ${name}`}</h3>
            <strong>7일 동안의 전력 소비량: </strong><p>{`${getPowerSum().toFixed(2)}Wh`}</p>
            <table border="1">
                <thead>
                <tr>
                    <th>Time</th>
                    <th>ON/OFF</th>
                    {logList.length > 0 && logList[0].step !== undefined && <th>Step</th>}
                </tr>
                </thead>
                <tbody>
                {visibleLogs.map((log) => (
                    <tr key={log.timestamp}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td>{log.is_active ? "ON" : "OFF"}</td>
                        {log.step !== undefined && <td>{log.step}</td>}
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <button onClick={handlePrevPage} disabled={page === 0}>
                    prev
                </button>
                <span>{` Page ${page + 1} of ${maxPage} `}</span>
                <button onClick={handleNextPage} disabled={page === maxPage - 1}>
                    next
                </button>
            </div>
        </div>
    );
}

export default DeviceLog;
