const overschrijvingForm = document.getElementById('overschrijving-form');
const feedback = document.getElementById('feedback');
const transactieAfbeelding = document.getElementById('transactie-afbeelding');

// Fictieve rekeningsaldi
const rekeningsaldi = {
    "Rekening 1": 1250.00,
    "Rekening 2": 500.00,
    "Rekening 3": 3200.00
};

overschrijvingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const vanRekening = document.getElementById('van-rekening').value;
    const naarRekening = document.getElementById('naar-rekening').value;
    const bedrag = parseFloat(document.getElementById('bedrag').value);

    // Validatie: Zelfde rekening en toereikend saldo
    if (vanRekening === naarRekening) {
        feedback.textContent = "Je kunt geen geld naar dezelfde rekening overschrijven.";
        feedback.style.color = "red";
        feedback.style.display = "block";
        return;
    }

    if (bedrag > rekeningsaldi[vanRekening]) {
        feedback.textContent = "Onvoldoende saldo op de bronrekening.";
        feedback.style.color = "red";
        feedback.style.display = "block";
        return;
    }

    // Transactie verwerken
    rekeningsaldi[vanRekening] -= bedrag;
    rekeningsaldi[naarRekening] += bedrag;

    // Feedback tonen
    feedback.textContent = `€${bedrag.toFixed(2)} is succesvol overgeschreven van ${vanRekening} naar ${naarRekening}.`;
    feedback.style.color = "green";
    feedback.style.display = "block";

    // Afbeelding tonen
    transactieAfbeelding.src = "transactie-voltooid.png"; // Voeg een afbeelding toe in je projectmap
    transactieAfbeelding.style.display = "block";

    // Reset formulier
    overschrijvingForm.reset();
});
