import React, { useState, useEffect } from "react";
import { getAllCategoryQuestions } from "../../../services/questionService";
import { Heart } from "react-bootstrap-icons";
import HomeHeader from "../../HomePage/HomeHeader";

const TestList = ({ onStartTest }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await getAllCategoryQuestions();
      setTests(response.data); // response.data là mảng category_question
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="h5">Đang tải danh sách bài test...</p>
        </div>
      </div>
    );
  return (
    <div className="container my-5">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="d-flex justify-content-center mb-3">
          <div className="bg-white rounded-circle p-3 shadow">
            <Heart size={32} className="text-danger" />
          </div>
        </div>
        <h1 className="display-5 mb-2">Hệ Thống Đánh Giá Sức Khỏe</h1>
        <p className="text-secondary">
          Chọn bài test để bắt đầu đánh giá sức khỏe của bạn
        </p>
      </div>

      {/* Test Grid */}
      <div className="row g-4 justify-content-center">
        {tests.map((test) => (
          <div key={test.id} className="col-md-6 col-lg-4">
            <TestCard test={test} onStartTest={onStartTest} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== TEST CARD COMPONENT =====
const TestCard = ({ test, onStartTest }) => {
  const handleStartTest = () => {
    onStartTest(test.id, test.description); // test.id là id của category_question
  };
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center mb-3">
          <Heart className="text-danger me-2" />
          <h5 className="card-title mb-0">{test.title}</h5>
        </div>
        <div className="d-flex justify-content-between text-muted mb-3 small">
          <span>📝 {test.questions?.length || 0} câu hỏi</span>
          <span>⏱️ {(test.questions?.length || 0) * 0.5} Phút</span>
        </div>
        <button onClick={handleStartTest} className="btn btn-primary mt-auto">
          Bắt Đầu Test
        </button>
      </div>
    </div>
  );
};

export default TestList;
