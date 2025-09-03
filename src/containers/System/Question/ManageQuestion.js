import React, { Component } from "react";
import axios from "axios";
import {
  createNewQuestion,
  editQuestion,
  getAllQuestions,
  getQuestionById,
  getAllCategoryQuestions,
  createNewCategoryQuestion,
  deleteQuestion,
} from "../../../services/questionService";
import CreatableSelect from "react-select/creatable";
import { LANGUAGE } from "../../../utils";

class ManageQuestion extends Component {
  state = {
    questions: [],
    options: [],
    selectedQuestion: null,
    question_text: "",
    is_active: true,
    optionInputs: [{ option_text: "", score: 0 }],
    isEditing: false,
    arrCategoryQuestion: [],
    selectedCategory: null,
    newCategoryTitle: "",
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    let res = await getAllCategoryQuestions();
    if (res && res.errCode === 0) {
      let dataSelect = this.buildDataInputSelect(res.data);
      this.setState({
        arrCategoryQuestion: dataSelect,
        selectedCategory: null,
        questions: [],
      });
    }
  };

  buildDataInputSelect = (inputData) => {
    let result = [];
    let language = this.props.language;
    if (inputData && inputData.length > 0) {
      inputData.forEach((item) => {
        let object = {};
        object.value = item.id;
        object.label = language === LANGUAGE.VI ? item.title : item.title;
        result.push(object);
      });
    }
    return result;
  };

  fetchQuestionsByCategory = async (categoryId) => {
    try {
      const res = await getAllQuestions({ category_question_id: categoryId });
      console.log("Fetched questions:", res);
      this.setState({
        questions: res.data || [],
        selectedQuestion: null,
        isEditing: false,
        question_text: "",
        optionInputs: [{ option_text: "", score: 0 }],
      });
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  handleCategoryChange = (selectedCategory) => {
    this.setState({ selectedCategory, newCategoryTitle: "" });
    if (selectedCategory && selectedCategory.value) {
      this.fetchQuestionsByCategory(selectedCategory.value);
    } else {
      this.setState({ questions: [] });
    }
  };

  handleCreateCategory = async (inputValue) => {
    let res = await createNewCategoryQuestion({ title: inputValue });
    if (res && res.errCode === 0) {
      const newOption = { value: res.data.id, label: res.data.title };
      this.setState(
        (prev) => ({
          arrCategoryQuestion: [...prev.arrCategoryQuestion, newOption],
          selectedCategory: newOption,
          newCategoryTitle: "",
        }),
        () => this.fetchQuestionsByCategory(newOption.value)
      );
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOptionChange = (idx, field, value) => {
    const optionInputs = [...this.state.optionInputs];
    optionInputs[idx][field] = value;
    this.setState({ optionInputs });
  };

  handleAddOption = () => {
    this.setState((prev) => ({
      optionInputs: [...prev.optionInputs, { option_text: "", score: 0 }],
    }));
  };

  handleRemoveOption = (idx) => {
    const optionInputs = [...this.state.optionInputs];
    optionInputs.splice(idx, 1);
    this.setState({ optionInputs });
  };

  handleSelectQuestion = async (q) => {
    try {
      const res = await getQuestionById(q.id);
      console.log("Question details:", res);
      this.setState({
        selectedQuestion: q,
        question_text: q.question_text,
        is_active: q.is_active,
        optionInputs: res.data.options?.length
          ? res.data.options.map((opt) => ({
              option_text: opt.option_text,
              score: opt.score,
              id: opt.id,
            }))
          : [{ option_text: "", score: 0 }],
        isEditing: true,
      });
    } catch (err) {
      alert("Lỗi tải đáp án!");
    }
  };

  handleResetForm = () => {
    this.setState({
      selectedQuestion: null,
      question_text: "",
      is_active: true,
      optionInputs: [{ option_text: "", score: 0 }],
      isEditing: false,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      question_text,
      is_active,
      optionInputs,
      selectedQuestion,
      isEditing,
      selectedCategory,
    } = this.state;
    if (!question_text.trim()) return alert("Vui lòng nhập nội dung câu hỏi!");
    if (!selectedCategory || !selectedCategory.value)
      return alert("Vui lòng chọn bài test (category)!");

    try {
      let questionId = selectedQuestion?.id;
      if (isEditing) {
        await editQuestion({
          question_text,
          category_question_id: selectedCategory.value,
          is_active,
          options: optionInputs,
          id: questionId,
        });
      } else {
        await createNewQuestion({
          question_text,
          category_question_id: selectedCategory.value,
          is_active,
          options: optionInputs,
        });
      }
      this.fetchQuestionsByCategory(selectedCategory.value);
      this.handleResetForm();
    } catch (err) {
      alert("Lỗi lưu câu hỏi!");
    }
  };

  handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa câu hỏi này?")) return;
    try {
      await deleteQuestion(id);
      if (this.state.selectedCategory && this.state.selectedCategory.value) {
        this.fetchQuestionsByCategory(this.state.selectedCategory.value);
      }
      this.handleResetForm();
    } catch (err) {
      alert("Lỗi xóa câu hỏi!");
    }
  };

  render() {
    const {
      questions,
      question_text,
      is_active,
      optionInputs,
      isEditing,
      selectedQuestion,
      arrCategoryQuestion,
      selectedCategory,
    } = this.state;

    return (
      <div className="container mt-4">
        <h2 className="fw-bold mb-4 text-primary text-center">
          Quản lý Câu hỏi Trắc nghiệm
        </h2>

        <div className="mb-3">
          <label className="form-label">
            Chọn hoặc tạo bài test (category)
          </label>
          <CreatableSelect
            value={selectedCategory}
            onChange={this.handleCategoryChange}
            options={arrCategoryQuestion}
            placeholder="Chọn hoặc nhập tên bài kiểm tra..."
            onCreateOption={this.handleCreateCategory}
          />
        </div>

        <div className="row">
          {/* Danh sách câu hỏi */}
          <div className="col-md-6 mb-3">
            <h5 className="fw-semibold">Danh sách câu hỏi</h5>
            <ul className="list-group">
              {questions.map((q) => (
                <li
                  key={q.id}
                  className={`list-group-item list-group-item-action ${
                    selectedQuestion?.id === q.id ? "active" : ""
                  }`}
                  onClick={() => this.handleSelectQuestion(q)}
                >
                  <div className="fw-medium">{q.question_text}</div>
                  <small className="text-muted">
                    {q.is_active ? "Hiện" : "Ẩn"}
                  </small>
                  <button
                    className="btn btn-sm btn-outline-danger float-end"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.handleDelete(q.id);
                    }}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Form thêm/sửa câu hỏi */}
          <div className="col-md-6">
            <h5 className="fw-semibold">
              {isEditing ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}
            </h5>
            <form onSubmit={this.handleSubmit} className="card p-3 shadow-sm">
              <div className="mb-3">
                <label className="form-label">Nội dung câu hỏi</label>
                <textarea
                  name="question_text"
                  value={question_text}
                  onChange={this.handleInputChange}
                  className="form-control"
                  rows={2}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <select
                  name="is_active"
                  value={is_active ? "true" : "false"}
                  onChange={(e) =>
                    this.setState({ is_active: e.target.value === "true" })
                  }
                  className="form-select"
                >
                  <option value="true">Hiện</option>
                  <option value="false">Ẩn</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Đáp án/Lựa chọn</label>
                {optionInputs.map((opt, idx) => (
                  <div key={idx} className="input-group mb-2">
                    <input
                      type="text"
                      placeholder={`Đáp án ${idx + 1}`}
                      value={opt.option_text}
                      onChange={(e) =>
                        this.handleOptionChange(
                          idx,
                          "option_text",
                          e.target.value
                        )
                      }
                      className="form-control"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Điểm"
                      value={opt.score}
                      onChange={(e) =>
                        this.handleOptionChange(idx, "score", e.target.value)
                      }
                      className="form-control"
                      style={{ maxWidth: "100px" }}
                      required
                    />
                    {optionInputs.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => this.handleRemoveOption(idx)}
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-link text-primary"
                  onClick={this.handleAddOption}
                >
                  + Thêm đáp án
                </button>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={this.handleResetForm}
                >
                  Làm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ManageQuestion;
