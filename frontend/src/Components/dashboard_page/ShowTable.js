import React , {useState} from "react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowTable = ({ cardId }) => {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/debt-schedule/${cardId}`);
                setSchedule(res.data);
            } catch (err) {
                console.error("Failed to load schedule:", err);
            }
        };

        fetchSchedule();
    }, [cardId]);

    return (
        <div>
            <h2>Repayment Schedule</h2>
            {schedule.length > 0 ? (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Card Name</th>
                            <th>Monthly Payment</th>
                            <th>Interest</th>
                            <th>Principal</th>
                            <th>Remaining Debt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.month}</td>
                                <td>{row.cardName}</td>
                                <td>₹{row.monthlyPayment}</td>
                                <td>₹{row.interest}</td>
                                <td>₹{row.principal}</td>
                                <td>₹{row.remainingDebt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No schedule to display.</p>
            )}
        </div>
    );
};

export default ShowTable;
