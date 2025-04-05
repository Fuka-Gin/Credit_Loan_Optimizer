import React, { useState } from "react";

const LoanTable = () => {
  const [salary, setSalary] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [tableData, setTableData] = useState([]);

  const calculateEMI = () => {
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseInt(loanPeriod) * 12;
    const P = parseFloat(loanAmount);
    const EMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    let remaining = P;
    let salaryLeft = parseFloat(salary);
    let rows = [];

    for (let i = 1; i <= n; i++) {
      const interest = remaining * r;
      const principal = EMI - interest;
      remaining -= principal;
      salaryLeft -= EMI;

      rows.push({
        month: i,
        emi: EMI.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        remaining: remaining.toFixed(2),
        salaryLeft: salaryLeft.toFixed(2)
      });
    }

    setTableData(rows);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-[600px] mt-6 md:mt-0">
      <h2 className="text-2xl font-semibold mb-4">Simple Loan EMI Table</h2>
      <input placeholder="Monthly Salary" onChange={(e) => setSalary(e.target.value)} className="border p-2 mb-2 w-full" />
      <input placeholder="Loan Amount" onChange={(e) => setLoanAmount(e.target.value)} className="border p-2 mb-2 w-full" />
      <input placeholder="Interest Rate (%)" onChange={(e) => setInterestRate(e.target.value)} className="border p-2 mb-2 w-full" />
      <input placeholder="Loan Term (Years)" onChange={(e) => setLoanPeriod(e.target.value)} className="border p-2 mb-4 w-full" />
      <button onClick={calculateEMI} className="bg-indigo-500 text-white px-4 py-2 rounded mb-4 w-full">Generate Table</button>

      <table className="w-full text-sm border">
        <thead className="bg-gray-300">
          <tr>
            <th className="border p-2">Month</th>
            <th className="border p-2">EMI</th>
            <th className="border p-2">Principal</th>
            <th className="border p-2">Interest</th>
            <th className="border p-2">Remaining</th>
            <th className="border p-2">Salary Left</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, i) => (
            <tr key={i}>
              <td className="border p-2">{row.month}</td>
              <td className="border p-2">${row.emi}</td>
              <td className="border p-2">${row.principal}</td>
              <td className="border p-2">${row.interest}</td>
              <td className="border p-2">${row.remaining}</td>
              <td className="border p-2">${row.salaryLeft}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanTable;
