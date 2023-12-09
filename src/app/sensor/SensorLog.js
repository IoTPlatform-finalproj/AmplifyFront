import {useEffect, useState} from "react";

function SensorLog({name, logList}) {
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

    const startIndex = page * logsPerPage;
    const endIndex = startIndex + logsPerPage;

    const visibleLogs = logList.slice(startIndex, endIndex);

    return (
        <div>
            <h3>{`Log: ${name}`}</h3>
            <table border="1">
                <thead>
                <tr>
                    <th>Time</th>
                    {logList.length > 0 && logList[0].is_on !== undefined && <th>ON/OFF</th>}
                    {logList.length > 0 && logList[0].value !== undefined && <th>Value</th>}
                </tr>
                </thead>
                <tbody>
                {visibleLogs.map((log) => (
                    <tr key={log.timestamp}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        {log.is_on !== undefined && <td>{log.is_on ? "ON" : "OFF"}</td>}
                        {log.value !== undefined && <td>{log.value}</td>}
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

export default SensorLog;
