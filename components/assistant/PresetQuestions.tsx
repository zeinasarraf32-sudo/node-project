interface PresetQuestionsProps {
  questions: string[];
  onSelectQuestion: (q: string) => void;
}

export default function PresetQuestions({
  questions,
  onSelectQuestion,
}: PresetQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelectQuestion(q)}
          className="px-4 py-2 bg-blue-50/70 hover:bg-blue-100/70 text-blue-600 border border-blue-100/80 rounded-full text-xs font-semibold transition text-left"
        >
          {q}
        </button>
      ))}
    </div>
  );
}