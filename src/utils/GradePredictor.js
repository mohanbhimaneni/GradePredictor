export class GradePredictor {
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

export const FORMULAS = {
  "MLT": "T = min(0.05×GAA + max(0.6×F + 0.25×max(Qz1,Qz2), 0.4×F + 0.25×Qz1 + 0.3×Qz2) + Bonus, 100)",
  "BDM": "T = 0.1×GA + 0.2×Qz1 + 0.2×Qz2 + 0.5×F",
  "MAD2": "T = min(0.05×GAA + max(0.6×F + 0.25×max(Qz1,Qz2), 0.4×F + 0.25×Qz1 + 0.3×Qz2) + Bonus, 100)"
};

export const HISTORY_KEY = "gradePredictor_history";
