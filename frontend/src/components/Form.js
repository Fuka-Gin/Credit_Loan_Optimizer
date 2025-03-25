import React, { useState } from "react";

const Form = ({ setLoanData }) => {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [months, setMonths] = useState(5);
  const [repaymentMethod, setRepaymentMethod] = useState("Snowball");
  const [cards, setCards] = useState([{ name: "", balance: "", interest: "" }]);

  const addCard = () => {
    setCards([...cards, { name: "", balance: "", interest: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoanData({ name, salary: Number(salary), months, repaymentMethod, cards });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />
      <input type="number" placeholder="Months" value={months} onChange={(e) => setMonths(e.target.value)} required />
      <select value={repaymentMethod} onChange={(e) => setRepaymentMethod(e.target.value)}>
        <option value="Snowball">Snowball Method</option>
        <option value="Avalanche">Avalanche Method</option>
      </select>

      {cards.map((card, index) => (
        <div key={index}>
          <input type="text" placeholder="Credit Card Name" value={card.name} onChange={(e) => handleChange(index, "name", e.target.value)} required />
          <input type="number" placeholder="Balance" value={card.balance} onChange={(e) => handleChange(index, "balance", e.target.value)} required />
          <input type="number" placeholder="Interest Rate (%)" value={card.interest} onChange={(e) => handleChange(index, "interest", e.target.value)} required />
        </div>
      ))}

      <button type="button" onClick={addCard}>Add Another Card</button>
      <button type="submit">Get Recommendation</button>
    </form>
  );
};

export default Form;
