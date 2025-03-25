import React, { useState } from "react";
import Form from "./components/Form";
import LoanTable from "./components/LoanTable";

const App = () => {
  const [loanData, setLoanData] = useState(null);

  return (
    <div>
      <h1>Credit Card Debt Optimizer</h1>
      <Form setLoanData={setLoanData} />
      {loanData && <LoanTable loanData={loanData} />}
    </div>
  );
};

export default App;
