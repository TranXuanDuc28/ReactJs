import React, { useState, useEffect } from "react";
import { Activity, Heart, Brain } from "lucide-react";
import { submitAssessment } from "../../../services/questionService";

const TestResult = ({
  testId,
  answers,
  onRestart,
  onBackToHome,
  result,
  setResult,
  testKey,
}) => {
  const [loading, setLoading] = useState(true);
  console.log("TestResult props:", result);
  useEffect(() => {
    if (answers.length === 0) {
      onBackToHome();
      return;
    }
    if (!result) {
      submitAnswers();
    } else {
      setLoading(false);
    }
  }, []);

  const submitAnswers = async () => {
    try {
      const userId = "user_" + Date.now();
      const response = await submitAssessment({
        userId,
        category_question_id: testId,
        testKey,
        answers,
      });
      setResult(response);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setLoading(false);
    }
  };

  const getHealthColor = (percentage) => {
    if (percentage >= 85) return "text-success bg-success-subtle";
    if (percentage >= 70) return "text-primary bg-primary-subtle";
    if (percentage >= 50) return "text-warning bg-warning-subtle";
    if (percentage >= 30) return "text-danger bg-danger-subtle";
    return "text-danger bg-danger-subtle";
  };

  const getHealthIcon = (percentage) => {
    if (percentage >= 70) return <Heart size={32} className="text-success" />;
    if (percentage >= 50)
      return <Activity size={32} className="text-primary" />;
    return <Brain size={32} className="text-warning" />;
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            style={{ width: "3rem", height: "3rem" }}
          ></div>
          <p className="fs-5 text-secondary">Đang xử lý kết quả...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <h2 className="text-danger fw-bold mb-3">Không thể tải kết quả</h2>
          <button onClick={onBackToHome} className="btn btn-primary">
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const { score, advice } = result;

  return (
    <div className="container py-5">
      <div className="card shadow-lg rounded-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient p-4 text-white text-center bg-primary">
          <h1 className="h3 fw-bold">Kết Quả</h1>
        </div>

        {/* Body */}
        <div className="card-body p-4">
          {/* Score */}
          <div className="d-flex justify-content-center align-items-center mb-4">
            {getHealthIcon(score.percentage)}
            <div className="ms-3 text-center">
              <div
                className={`display-4 fw-bold ${
                  getHealthColor(score.percentage).split(" ")[0]
                } mb-2`}
              >
                {score.percentage}%
              </div>
              <div
                className={`badge rounded-pill px-3 py-2 ${getHealthColor(
                  score.percentage
                )}`}
              >
                {score.totalScore}/{score.maxScore} điểm
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress mb-4" style={{ height: "12px" }}>
            <div
              className={`progress-bar ${getHealthColor(score.percentage)}`}
              role="progressbar"
              style={{ width: `${score.percentage}%` }}
              aria-valuenow={score.percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

          {/* Advice */}
          <div className="bg-light rounded-3 p-3 mb-4">
            <h5 className="fw-semibold text-dark mb-3 d-flex align-items-center">
              <Brain size={20} className="me-2 text-primary" />
              Lời Khuyên Sức Khỏe
            </h5>
            {advice
              .replace(/\*\*/g, "")
              .replace(/\#\#/g, "")
              .split("\\n\\n")
              .map(
                (line, index) =>
                  line.trim() && (
                    <p key={index} className="text-secondary mb-2">
                      {line.split("\\n").map((subline, subIndex) => (
                        <React.Fragment key={subIndex}>
                          {subline}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  )
              )}
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-3">
            <button onClick={onRestart} className="btn btn-primary">
              Làm Lại Bài Test
            </button>
            <button onClick={onBackToHome} className="btn btn-secondary">
              Trang Chủ
            </button>
            <button onClick={() => window.print()} className="btn btn-success">
              In Kết Quả
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResult;
