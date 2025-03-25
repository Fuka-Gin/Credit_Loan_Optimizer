import React from "react";

const LoanTable = ({ loanData }) => {
  const { salary, months, cards } = loanData;

  const calculatePayments = (method) => {
    let sortedCards = [...cards];
    if (method === "Snowball") {
      sortedCards.sort((a, b) => a.balance - b.balance);
    } else {
      sortedCards.sort((a, b) => b.interest - a.interest);
    }

    let monthlySalary = salary;
    let loanRecords = [];

    for (let month = 1; month <= months; month++) {
      let remainingSalary = monthlySalary;
      let clearedLoans = 0;

      sortedCards = sortedCards.map((card) => {
        if (card.balance > 0 && remainingSalary > 0) {
          let payment = Math.min(remainingSalary, card.balance);
          card.balance -= payment;
          remainingSalary -= payment;
          clearedLoans += payment;
        }
        return card;
      });

      loanRecords.push({
        month,
        salary: monthlySalary,
        clearedLoans,
        remainingSalary,
        remainingLoans: sortedCards.map((card) => ({
          name: card.name,
          balance: card.balance.toFixed(2),
        })),
      });
    }
    return loanRecords;
  };

  const snowballData = calculatePayments("Snowball");
  const avalancheData = calculatePayments("Avalanche");

  return (
    <div>
      <h2>Snowball Method</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Month</th>
            <th>Salary</th>
            <th>Loans Cleared</th>
            <th>Remaining Salary</th>
            <th>Remaining Loans</th>
          </tr>
        </thead>
        <tbody>
          {snowballData.map((data) => (
            <tr key={data.month}>
              <td>{data.month}</td>
              <td>{data.salary}</td>
              <td>{data.clearedLoans}</td>
              <td>{data.remainingSalary}</td>
              <td>{data.remainingLoans.map((loan) => `${loan.name}: $${loan.balance}`).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Avalanche Method</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Month</th>
            <th>Salary</th>
            <th>Loans Cleared</th>
            <th>Remaining Salary</th>
            <th>Remaining Loans</th>
          </tr>
        </thead>
        <tbody>
          {avalancheData.map((data) => (
            <tr key={data.month}>
              <td>{data.month}</td>
              <td>{data.salary}</td>
              <td>{data.clearedLoans}</td>
              <td>{data.remainingSalary}</td>
              <td>{data.remainingLoans.map((loan) => `${loan.name}: $${loan.balance}`).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanTable;
