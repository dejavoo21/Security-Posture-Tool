import type { Question } from "../../types/question";

type QuestionCardProps = {
  question: Question;
  domainName?: string;
  questionNumber: number;
  totalQuestions: number;
  selectedValue?: number;
  onSelect: (value: number) => void;
};

const optionHelper: Record<number, string> = {
  0: "Not in place yet",
  1: "Ad hoc or inconsistent",
  3: "Implemented in key areas",
  5: "Well established and operating"
};

export function QuestionCard({
  question,
  domainName,
  questionNumber,
  totalQuestions,
  selectedValue,
  onSelect
}: QuestionCardProps) {
  return (
    <section className="question-card question-shell">
      <div className="question-meta">
        <span className="badge">{domainName ?? question.domainId}</span>
        <span className="info-pill">Question {questionNumber} / {totalQuestions}</span>
      </div>

      <div>
        <p className="muted-text" style={{ marginBottom: 8 }}>Select the answer that best matches the current state of your organization.</p>
        <h2 style={{ marginBottom: 0 }}>{question.text}</h2>
      </div>

      <div className="option-grid">
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={`${question.id}-${option.label}`}
              type="button"
              onClick={() => onSelect(option.value)}
              className={`option-button${isSelected ? " option-button--selected" : ""}`}
            >
              <span className="option-copy">
                <span className="option-label">{option.label}</span>
                <span className="option-note">{optionHelper[option.value] ?? "Weighted answer"}</span>
              </span>
              <span className="option-value">{option.value}/5</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
