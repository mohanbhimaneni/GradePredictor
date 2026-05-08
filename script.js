class GradePredictor {
    constructor(subject) {
        this.subject = subject;
        this.validSubjects = ["MLT", "BDM", "MAD2"];

        if (!this.validSubjects.includes(this.subject)) {
            throw new Error("Subject not defined");
        }
    }

    validate(number) {
        if (number < 0 || number > 100) {
            throw new Error("Invalid input: must be between 0 and 100");
        }
    }

    getFormula(x) {
        switch (this.subject) {
            case "MLT":
                return Math.min(
                    0.05 * this.gaa +
                    Math.max(
                        0.6 * x + 0.25 * Math.max(this.qI, this.qII),
                        0.4 * x + 0.25 * this.qI + 0.3 * this.qII
                    ) +
                    this.bonus,
                    100
                );

            case "BDM":
                return 0.1 * this.ga + 0.2 * this.qI + 0.2 * this.qII + 0.5 * x;

            case "MAD2":
                return Math.min(
                    0.05 * this.gaa +
                    Math.max(
                        0.6 * x + 0.25 * Math.max(this.qI, this.qII),
                        0.4 * x + 0.25 * this.qI + 0.3 * this.qII
                    ) +
                    this.bonus,
                    100
                );

            default:
                throw new Error("Subject not defined");
        }
    }

    getPredictions() {
        const predictions = [];
        for (let i = 0; i <= 100; i++) {
            const t = this.getFormula(i);
            predictions.push([i, Math.round(t * 100) / 100]);
        }
        return predictions;
    }

    getGradeTable(predictions) {
        const gradeCutoffs = {
            "S": 90,
            "A": 80,
            "B": 70,
            "C": 60,
            "D": 50,
            "E": 40
        };

        const results = [];
        for (const [grade, cutoff] of Object.entries(gradeCutoffs)) {
            let found = false;

            for (const [f, total] of predictions) {
                if (total >= cutoff) {
                    results.push({ grade, minF: f, total });
                    found = true;
                    break;
                }
            }

            if (!found) {
                results.push({ grade, minF: "N/A", total: "N/A" });
            }
        }

        return results;
    }
}

// DOM Elements
const subjectSelect = document.getElementById("subject");
const inputsContainer = document.getElementById("inputs-container");
const bonusContainer = document.getElementById("bonus-container");
const gaaInput = document.getElementById("gaa");
const gaInput = document.getElementById("ga");
const qz1Input = document.getElementById("qz1");
const qz2Input = document.getElementById("qz2");
const bonusInput = document.getElementById("bonus");
const calculateBtn = document.getElementById("calculate-btn");
const resetBtn = document.getElementById("reset-btn");
const resultsContainer = document.getElementById("results-container");
const resultsTable = document.getElementById("results-table");
const errorContainer = document.getElementById("error-container");
const errorMessage = document.getElementById("error-message");
const gaaLabel = document.getElementById("label-gaa");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");

const HISTORY_KEY = "gradePredictor_history";

// Event Listeners
subjectSelect.addEventListener("change", handleSubjectChange);
calculateBtn.addEventListener("click", handleCalculate);
resetBtn.addEventListener("click", handleReset);
clearHistoryBtn.addEventListener("click", handleClearHistory);

// Initialize history on page load
document.addEventListener("DOMContentLoaded", loadHistory);

function handleSubjectChange() {
    const subject = subjectSelect.value;

    if (!subject) {
        inputsContainer.style.display = "none";
        resultsContainer.style.display = "none";
        errorContainer.style.display = "none";
        return;
    }

    inputsContainer.style.display = "block";
    resultsContainer.style.display = "none";
    errorContainer.style.display = "none";

    // Update labels based on subject
    if (subject === "BDM") {
        gaaLabel.textContent = "Enter GA:";
        bonusContainer.style.display = "none";
    } else {
        gaaLabel.textContent = "Enter GAA:";
        bonusContainer.style.display = "block";
    }

    // Clear inputs
    gaaInput.value = "";
    qz1Input.value = "";
    qz2Input.value = "";
    bonusInput.value = "";
    clearErrorMessages();
}

function clearErrorMessages() {
    document.querySelectorAll(".error-message").forEach(el => {
        el.textContent = "";
    });
}

function validateInput(value, inputId) {
    try {
        const num = value === "" ? null : parseInt(value);

        if (num === null) {
            throw new Error("This field is required");
        }

        if (isNaN(num) || num < 0 || num > 100) {
            throw new Error("Must be between 0 and 100");
        }

        document.getElementById(inputId).parentElement.querySelector(".error-message").textContent = "";
        return num;
    } catch (error) {
        document.getElementById(inputId).parentElement.querySelector(".error-message").textContent = error.message;
        return null;
    }
}

function handleCalculate() {
    clearErrorMessages();
    errorContainer.style.display = "none";

    const subject = subjectSelect.value;

    // Validate inputs
    let gaaValue = null;
    let qz1Value = null;
    let qz2Value = null;
    let bonusValue = 0;

    if (subject === "BDM") {
        gaaValue = validateInput(gaInput.value, "gaa");
    } else {
        gaaValue = validateInput(gaaInput.value, "gaa");
    }

    qz1Value = validateInput(qz1Input.value, "qz1");
    qz2Value = validateInput(qz2Input.value, "qz2");

    if (subject !== "BDM") {
        bonusValue = validateInput(bonusInput.value, "bonus");
    }

    // Check if any validation failed
    if (gaaValue === null || qz1Value === null || qz2Value === null || (subject !== "BDM" && bonusValue === null)) {
        return;
    }

    try {
        // Create predictor instance
        const predictor = new GradePredictor(subject);

        // Set inputs
        if (subject === "BDM") {
            predictor.ga = gaaValue;
        } else {
            predictor.gaa = gaaValue;
        }
        predictor.qI = qz1Value;
        predictor.qII = qz2Value;
        predictor.bonus = bonusValue;

        // Get predictions
        const predictions = predictor.getPredictions();
        const gradeTable = predictor.getGradeTable(predictions);

        // Display results
        displayResults(gradeTable);
        resultsContainer.style.display = "block";
        inputsContainer.scrollIntoView({ behavior: "smooth" });

        // Save to history
        saveToHistory(subject, gaaValue, qz1Value, qz2Value, bonusValue, gradeTable);

    } catch (error) {
        showError(error.message);
    }
}

function displayResults(gradeTable) {
    resultsTable.innerHTML = "";

    gradeTable.forEach(row => {
        const tr = document.createElement("tr");
        const gradeCell = document.createElement("td");
        const minFCell = document.createElement("td");
        const totalCell = document.createElement("td");

        gradeCell.textContent = row.grade;
        minFCell.textContent = row.minF;
        totalCell.textContent = row.total;

        tr.appendChild(gradeCell);
        tr.appendChild(minFCell);
        tr.appendChild(totalCell);

        resultsTable.appendChild(tr);
    });
}

function showError(message) {
    errorMessage.textContent = message;
    errorContainer.style.display = "block";
}

function handleReset() {
    subjectSelect.value = "";
    inputsContainer.style.display = "none";
    resultsContainer.style.display = "none";
    errorContainer.style.display = "none";
    gaaInput.value = "";
    qz1Input.value = "";
    qz2Input.value = "";
    bonusInput.value = "";
    clearErrorMessages();
}

// History Management Functions

function saveToHistory(subject, gaaValue, qz1Value, qz2Value, bonusValue, gradeTable) {
    const historyItem = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        subject,
        gaaValue,
        qz1Value,
        qz2Value,
        bonusValue,
        gradeTable
    };

    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    history.unshift(historyItem); // Add to beginning (newest first)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-message">No predictions yet. Start by selecting a subject!</p>';
        return;
    }

    historyList.innerHTML = "";

    history.forEach(item => {
        const historyItemEl = createHistoryItemElement(item);
        historyList.appendChild(historyItemEl);
    });
}

function createHistoryItemElement(item) {
    const container = document.createElement("div");
    container.className = "history-item";

    const header = document.createElement("div");
    header.className = "history-item-header";

    const subject = document.createElement("span");
    subject.className = "history-item-subject";
    subject.textContent = item.subject;

    const time = document.createElement("span");
    time.className = "history-item-time";
    time.textContent = item.timestamp;

    header.appendChild(subject);
    header.appendChild(time);
    container.appendChild(header);

    // Details section
    const details = document.createElement("div");
    details.className = "history-item-details";

    const gaaLabel = item.subject === "BDM" ? "GA" : "GAA";
    const detailItems = [
        { label: gaaLabel, value: item.gaaValue },
        { label: "Qz1", value: item.qz1Value },
        { label: "Qz2", value: item.qz2Value }
    ];

    if (item.subject !== "BDM") {
        detailItems.push({ label: "Bonus", value: item.bonusValue });
    }

    detailItems.forEach(detail => {
        const detailEl = document.createElement("div");
        detailEl.className = "history-item-detail";
        detailEl.innerHTML = `<label>${detail.label}</label><value>${detail.value}</value>`;
        details.appendChild(detailEl);
    });

    container.appendChild(details);

    // Result section - show first grade that can be achieved
    if (item.gradeTable.length > 0) {
        const firstGrade = item.gradeTable[0];
        const result = document.createElement("div");
        result.className = "history-item-result";
        result.innerHTML = `<label>Best possible grade</label><value>${firstGrade.grade} (needs F ≥ ${firstGrade.minF === "N/A" ? "N/A" : firstGrade.minF})</value>`;
        container.appendChild(result);
    }

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-small btn-danger";
    deleteBtn.textContent = "Remove";
    deleteBtn.style.marginTop = "10px";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteHistoryItem(item.id);
    });
    container.appendChild(deleteBtn);

    return container;
}

function deleteHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    history = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    loadHistory();
}

function handleClearHistory() {
    if (confirm("Are you sure you want to delete all history? This cannot be undone.")) {
        localStorage.removeItem(HISTORY_KEY);
        loadHistory();
    }
}
