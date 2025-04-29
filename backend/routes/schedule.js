app.get("/api/debt-schedule/:cardId", async (req, res) => {
    try {
        const { cardId } = req.params;
        const creditCard = await CreditCard.findById(cardId);

        if (!creditCard) return res.status(404).json({ message: "Credit card not found" });

        let schedule = [];
        let debt = creditCard.debtOwed;
        const interestRate = creditCard.interestRate / 100 / 12; // monthly interest
        const minPayment = creditCard.minimumPayment;
        const extra = creditCard.extraAmount || 0;
        const monthlyPayment = minPayment + extra;

        let month = 1;

        while (debt > 0 && monthlyPayment > 0) {
            let interest = debt * interestRate;
            let principal = Math.min(monthlyPayment - interest, debt);
            debt = Math.max(debt - principal, 0);

            schedule.push({
                month: month++,
                cardName: creditCard.cardName,
                monthlyPayment: monthlyPayment.toFixed(2),
                interest: interest.toFixed(2),
                principal: principal.toFixed(2),
                remainingDebt: debt.toFixed(2)
            });
        }

        res.json(schedule);
    } catch (error) {
        console.error("Error generating schedule:", error);
        res.status(500).json({ message: "Failed to generate debt schedule" });
    }
});
