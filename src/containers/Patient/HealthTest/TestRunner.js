import React, { useState, useEffect } from "react";
import {
  getAllQuestions,
  getQuestionById,
  getQuestionsByCategory,
} from "../../../services/questionService";
import {
  CheckCircleFill,
  ArrowLeft,
  ArrowRight,
  HouseDoorFill,
} from "react-bootstrap-icons";

const TestRunner = ({ testId, onComplete, onBack, testData, setTestData }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testData) fetchTestQuestions();
    else setLoading(false);
  }, [testId]);
  console.log("Test Data:", testData);
  const fetchTestQuestions = async () => {
    try {
      const response = await getQuestionsByCategory(testId);
      const questions = response.data || [];
      const test = {
        id: testId,
        questions: questions.map((q) => ({
          id: q.id,
          question_text: q.question_text,
          options: q.options
            ? q.options.map((opt) => ({
                option_text: opt.option_text,
                score: opt.score,
              }))
            : [],
        })),
      };
      setTestData(test);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  const handleSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[current] = {
      question_id: testData.questions[current].id,
      option_text: testData.questions[current].options[optionIndex].option_text,
      score: testData.questions[current].options[optionIndex].score,
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < testData.questions.length - 1) setCurrent(current + 1);
    else onComplete(answers);
  };

  const handlePrevious = () => {
    if (current > 0) setCurrent(current - 1);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="h5">Đang tải bài test...</p>
        </div>
      </div>
    );

  if (!testData || !testData.questions || testData.questions.length === 0)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h2 className="text-danger mb-3">Không tìm thấy bài test</h2>
          <button className="btn btn-primary" onClick={onBack}>
            <HouseDoorFill className="me-2" /> Quay về trang chủ
          </button>
        </div>
      </div>
    );

  const currentQuestion = testData.questions[current];
  console.log("Current Question:", currentQuestion);
  const selectedAnswer = answers[current];
  const progress = ((current + 1) / testData.questions.length) * 100;

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="card-title mb-0">{testData.title}</h3>
            <small>
              Câu {current + 1} / {testData.questions.length}
            </small>
          </div>
          <div className="progress mb-2" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <small>Tiến độ: {Math.round(progress)}%</small>
        </div>
      </div>

      {/* Question Card */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h5 className="mb-4">
            <span className="badge bg-primary me-2">#{current + 1}</span>
            {currentQuestion.question_text}
          </h5>
          <div className="d-grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`btn text-start border ${
                  selectedAnswer?.option_text === option.option_text
                    ? "btn-primary text-white"
                    : "btn-outline-secondary"
                }`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span>{option.option_text}</span>
                  {selectedAnswer?.option_text === option.option_text && (
                    <CheckCircleFill className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="d-flex justify-content-between">
        <button
          onClick={current === 0 ? onBack : handlePrevious}
          className="btn btn-secondary d-flex align-items-center"
        >
          {current === 0 ? (
            <>
              <HouseDoorFill className="me-2" /> Trang chủ
            </>
          ) : (
            <>
              <ArrowLeft className="me-2" /> Quay lại
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={`btn d-flex align-items-center ${
            selectedAnswer ? "btn-primary" : "btn-outline-secondary"
          }`}
        >
          {current < testData.questions.length - 1 ? (
            <>
              Tiếp theo <ArrowRight className="ms-2" />
            </>
          ) : (
            <>
              Nộp bài <CheckCircleFill className="ms-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TestRunner;
