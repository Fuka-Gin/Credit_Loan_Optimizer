import React, { useState } from "react";
import axios from "axios";

const Form = () => {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [years, setYears] = useState("");
  const [method, setMethod] = useState("Snowball Method");
  const [cards, setCards] = useState([{ name: "", balance: "", interest: "" }]);
  const [result, setResult] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const addCard = () => {
    setCards([...cards, { name: "", balance: "", interest: "" }]);
  };

  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/recommend", {
        name,
        salary: parseFloat(salary),
        years: parseInt(years),
        method,
        cards,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    }
  };

  const handleReset = () => {
    setName("");
    setSalary("");
    setYears("");
    setCards([{ name: "", balance: "", interest: "" }]);
    setResult(null);
    setShowTable(false);
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg w-full md:w-[400px] shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Credit Card Debt Optimizer</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded w-full" />
        <input type="number" placeholder="Monthly Salary ($)" value={salary} onChange={(e) => setSalary(e.target.value)} className="p-2 border rounded w-full" />
        <input type="number" placeholder="Loan Period (Years)" value={years} onChange={(e) => setYears(e.target.value)} className="p-2 border rounded w-full" />

        <select value={method} onChange={(e) => setMethod(e.target.value)} className="p-2 border rounded w-full">
          <option value="Snowball Method">Snowball Method</option>
          <option value="Avalanche Method">Avalanche Method</option>
        </select>

        <h3 className="text-lg font-semibold">Credit Cards</h3>
        {cards.map((card, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded mb-2">
            <input type="text" placeholder="Card Name" value={card.name} onChange={(e) => updateCard(index, "name", e.target.value)} className="p-2 border rounded w-full mb-2" />
            <input type="number" placeholder="Balance ($)" value={card.balance} onChange={(e) => updateCard(index, "balance", e.target.value)} className="p-2 border rounded w-full mb-2" />
            <input type="number" placeholder="Interest Rate (%)" value={card.interest} onChange={(e) => updateCard(index, "interest", e.target.value)} className="p-2 border rounded w-full" />
          </div>
        ))}

        <button type="button" onClick={addCard} className="bg-blue-500 text-white p-2 rounded w-full">+ Add Card</button>
        <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">Get Recommendation</button>
        <button type="button" onClick={() => setShowTable(true)} className="bg-yellow-500 text-white p-2 rounded w-full">Show Table</button>
        <button type="button" onClick={handleReset} className="bg-red-600 text-white p-2 rounded w-full">Reset</button>
      </form>

      {showTable && result && (
        <div className="bg-white text-black p-6 mt-6 rounded-lg w-full shadow-lg">
          <h3 className="text-xl font-bold mb-4">Monthly Breakdown</h3>
          <table className="w-full text-sm">
            <thead className="bg-gray-300">
              <tr>
                <th className="p-2 border">Month</th>
                <th className="p-2 border">Loans Cleared</th>
                <th className="p-2 border">Remaining Loans</th>
                <th className="p-2 border">Remaining Salary</th>
              </tr>
            </thead>
            <tbody>
              {result.statistics.map((stat, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{stat.month}</td>
                  <td className="p-2 border">${stat.loansCleared.toFixed(2)}</td>
                  <td className="p-2 border">{stat.remainingLoans}</td>
                  <td className="p-2 border">${stat.remainingSalary.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 italic text-blue-600">{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default Form;
