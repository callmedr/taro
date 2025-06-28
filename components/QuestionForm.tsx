import React, { useState } from 'react';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) {
      alert('질문을 입력해주세요.');
      return;
    }
    onSubmit(question.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mb-8">
      <label htmlFor="tarot-question" className="block text-lg font-medium text-purple-300 mb-2">
        지금 가장 궁금한 걸 떠올려보세요.
      </label>
      <textarea
        id="tarot-question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={"어떤 질문도 다 괜찮아요.\n예1: 오늘 등산을 할까 하는데, 좋은 선택일까요?\n예2: 저의 연애운은 어떤가요?"}
        rows={4}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder-gray-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            해석 중...
          </>
        ) : (
          '우주의 메시지 열어보기'
        )}
      </button>
    </form>
  );
};

export default QuestionForm;