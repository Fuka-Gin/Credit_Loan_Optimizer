import React from "react";
import Form from "./Form";
import LoanTable from "./LoanTable";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 p-6 text-white">
      <h1 className="text-4xl font-bold text-center mb-6">Debt & Loan Optimizer</h1>
      <div className="flex flex-col md:flex-row justify-center items-start gap-8">
        <Form />
        <LoanTable />
      </div>
    </div>
  );
};

export default App;
