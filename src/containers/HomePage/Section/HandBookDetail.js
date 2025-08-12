import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import HomeHeader from "../../HomePage/HomeHeader";
import {
  getAllDetailHandBookById,
  getRelatedHandBooks,
} from "../../../services/userServices";
import LoadingSpinner from "../../../components/LoadingSpinner";
import _ from "lodash";
import "./HandBookDetail.scss";

class HandBookDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      relatedArticles: [],
      loading: true,
      error: null,
      contentProcessed: false,
      headings: [],
      activeHeadingId: "",
    };
    this.observer = null;
  }

  async componentDidMount() {
    const id = this.props.match.params.id;
    if (!id) {
      this.setState({
        loading: false,
        error: "Không tìm thấy ID bài viết",
      });
      return;
    }

    try {
      // Fetch handbook detail
      const res = await getAllDetailHandBookById({ id: id });
      if (res.data) {
        // Process content and get headings
        const processed = this.processContentWithAnchors(res.data.contentHTML);

        this.setState({
          data: {
            ...res.data,
            contentHTML: processed.html
          },
          headings: processed.headings,
          loading: false,
          contentProcessed: true
        }, () => {
          // Observe headings sau khi component đã render
          setTimeout(() => {
            this.observeHeadings();
          }, 100);
        });

        // Fetch related articles
        try {
          const relatedRes = await getRelatedHandBooks({ id: id, limit: 4 });
          if (relatedRes.data) {
            this.setState({ relatedArticles: relatedRes.data });
          }
        } catch (relatedError) {
          console.log("Error fetching related articles:", relatedError);
        }
      } else {
        this.setState({
          loading: false,
          error: "Không tìm thấy bài viết",
        });
      }
    } catch (e) {
      console.error("Error fetching handbook:", e);
      this.setState({
        loading: false,
        error: "Có lỗi xảy ra khi tải bài viết",
      });
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  };

  processContentWithAnchors = (contentHTML) => {
    if (!contentHTML) return { html: "", headings: [] };

    const parser = new DOMParser();
    const doc = parser.parseFromString(contentHTML, "text/html");

    const headingsData = [];
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

    headings.forEach((h, index) => {
      const text = h.textContent.trim();
      if (!text) return;

      const id = this.generateSlug(text) || `section-${index}`;
      h.setAttribute("id", id);
      h.className = (h.className || '') + ' content-section';

      headingsData.push({
        id,
        text,
        level: parseInt(h.tagName.charAt(1)),
        tagName: h.tagName.toLowerCase()
      });
    });

    return {
      html: doc.body.innerHTML,
      headings: headingsData,
    };
  };

  observeHeadings = () => {
    if (this.observer) this.observer.disconnect();

    const options = {
      root: null,
      rootMargin: "-100px 0px -60% 0px",
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.setState({ activeHeadingId: entry.target.id });
        }
      });
    }, options);

    this.state.headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) this.observer.observe(el);
    });
  };

  scrollToSection = (sectionTitle, index, sectionId) => {
    console.log('Scrolling to section:', { sectionTitle, index, sectionId });

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Set active heading
      this.setState({ activeHeadingId: sectionId });

      // Highlight section
      this.highlightSection(sectionId);
    }
  };

  highlightSection = (sectionId) => {
    // Remove highlight từ tất cả sections
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('highlighted');
    });

    // Add highlight cho section được click
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('highlighted');

      // Remove highlight sau 3 giây
      setTimeout(() => {
        targetSection.classList.remove('highlighted');
      }, 3000);
    }
  };

  handleBackToHome = () => {
    this.props.history.push("/home");
  };

  handleBackToHandbook = () => {
    this.props.history.push("/handbook");
  };

  handleShare = (platform) => {
    const url = window.location.href;
    const title = this.state.data.title || "Bài viết y tế";
    const text = "Chia sẻ bài viết y tế hữu ích";

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url).then(() => {
          alert("Đã sao chép link!");
        });
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  handleBookAppointment = () => {
    this.props.history.push("/booking");
  };

  handleStartAI = () => {
    this.props.history.push("/chat-patient");
  };

  render() {
    const { data, relatedArticles, loading, error, headings, activeHeadingId } = this.state;

    if (loading) {
      return (
        <div className="handbook-detail-page">
          <HomeHeader />
          <div className="loading-container">
            <LoadingSpinner size="large" text="Đang tải bài viết..." />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="handbook-detail-page">
          <HomeHeader />
          <div className="error-container">
            <div className="error-content">
              <i
                className="fa fa-exclamation-triangle text-warning mb-3"
                style={{ fontSize: "3rem" }}
              ></i>
              <h3>Không thể tải bài viết</h3>
              <p className="text-muted">{error}</p>
              <div className="mt-4">
                <button
                  className="btn btn-primary me-2"
                  onClick={this.handleBackToHome}
                >
                  Về trang chủ
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={this.handleBackToHandbook}
                >
                  Xem cẩm nang khác
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!data || _.isEmpty(data)) {
      return (
        <div className="handbook-detail-page">
          <HomeHeader />
          <div className="error-container">
            <div className="error-content">
              <i
                className="fa fa-file-text text-muted mb-3"
                style={{ fontSize: "3rem" }}
              ></i>
              <h3>Không tìm thấy bài viết</h3>
              <p className="text-muted">
                Bài viết này có thể đã bị xóa hoặc không tồn tại.
              </p>
              <div className="mt-4">
                <button
                  className="btn btn-primary me-2"
                  onClick={this.handleBackToHome}
                >
                  Về trang chủ
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={this.handleBackToHandbook}
                >
                  Xem cẩm nang khác
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="handbook-detail-page">
        <HomeHeader />

        {/* Breadcrumb */}
        <div className="breadcrumb-container">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={this.handleBackToHome}
                  >
                    Trang chủ
                  </button>
                </li>
                <li className="breadcrumb-item">
                  <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={this.handleBackToHandbook}
                  >
                    Cẩm nang
                  </button>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {data.title}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Banner */}
        <div
          className="handbook-banner"
          style={{
            background: `url(${data.image}) center center/cover no-repeat`,
            minHeight: 300,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="banner-overlay"></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-10 mx-auto text-center">
                <h1 className="banner-title">{data.title}</h1>
                <div className="banner-meta">
                  <span className="meta-item">
                    <i className="fa fa-calendar me-1"></i>
                    {data.published || "Chưa có ngày xuất bản"}
                  </span>
                  <span className="meta-item">
                    <i className="fa fa-eye me-1"></i>
                    {data.views || "0"} lượt xem
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container py-5">
          <div className="row">
            {/* Left: Nội dung bài viết */}
            <div className="col-lg-8 col-12">
              <div className="content-wrapper">
                {/* Article meta */}
                <div className="article-meta mb-4">
                  <div className="meta-row">
                    <span className="meta-label">Tác giả:</span>
                    <span className="meta-value">
                      {data.authors?.length > 0
                        ? data.authors.join(", ")
                        : "BookingCare Team"}
                    </span>
                  </div>
                  {data.reviewers?.length > 0 && (
                    <div className="meta-row">
                      <span className="meta-label">Kiểm duyệt:</span>
                      <span className="meta-value">
                        {data.reviewers.join(", ")}
                      </span>
                    </div>
                  )}
                  <div className="meta-row">
                    <span className="meta-label">Cập nhật:</span>
                    <span className="meta-value">
                      {data.updated || data.published || "Chưa có thông tin"}
                    </span>
                  </div>
                </div>

                {/* Article content */}
                <div className="article-content">
                  {data && !_.isEmpty(data) && data.contentHTML && (
                    <div
                      className="content-html"
                      dangerouslySetInnerHTML={{
                        __html: data.contentHTML,
                      }}
                    ></div>
                  )}
                </div>

                {/* Social sharing */}
                <div className="social-sharing mt-5">
                  <h5 className="mb-3">Chia sẻ bài viết</h5>
                  <div className="share-buttons">
                    <button
                      className="btn btn-outline-primary me-2"
                      onClick={() => this.handleShare("facebook")}
                    >
                      <i className="fa fa-facebook me-1"></i>
                      Facebook
                    </button>
                    <button
                      className="btn btn-outline-info me-2"
                      onClick={() => this.handleShare("twitter")}
                    >
                      <i className="fa fa-twitter me-1"></i>
                      Twitter
                    </button>
                    <button
                      className="btn btn-outline-secondary me-2"
                      onClick={() => this.handleShare("linkedin")}
                    >
                      <i className="fa fa-linkedin me-1"></i>
                      LinkedIn
                    </button>
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => this.handleShare("copy")}
                    >
                      <i className="fa fa-link me-1"></i>
                      Sao chép link
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="col-lg-4 col-12">
              <div className="sidebar-wrapper">
                {/* Table of contents */}
                {headings.length > 0 && (
                  <div className="sidebar-card mb-4">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <i className="fa fa-list me-2"></i>
                        Nội dung chính
                      </h5>
                    </div>
                    <div className="card-body">
                      <ul className="toc-list">
                        {headings.map((item, idx) => (
                          <li key={item.id} className={`toc-item toc-level-${item.level}`}>
                            <button
                              className={`toc-link ${activeHeadingId === item.id ? 'active' : ''}`}
                              onClick={() => this.scrollToSection(item.text, idx, item.id)}
                              title={`Cuộn đến: ${item.text}`}
                            >
                              {item.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Book appointment */}
                <div className="sidebar-card mb-4">
                  <div className="card-body text-center">
                    <i
                      className="fa fa-calendar-check text-primary mb-3"
                      style={{ fontSize: "2rem" }}
                    ></i>
                    <h5 className="mb-3">Đặt lịch khám</h5>
                    <p className="text-muted mb-3">
                      Đặt lịch khám với bác sĩ chuyên khoa hàng đầu
                    </p>
                    <button
                      className="btn btn-warning w-100 fw-bold"
                      onClick={this.handleBookAppointment}
                    >
                      ĐẶT KHÁM NGAY
                    </button>
                  </div>
                </div>

                {/* AI Assistant */}
                <div className="sidebar-card">
                  <div className="card-body text-center">
                    <i
                      className="fa fa-robot text-info mb-3"
                      style={{ fontSize: "2rem" }}
                    ></i>
                    <h5 className="mb-3">Trợ lý AI</h5>
                    <p className="text-muted mb-3">
                      Hỏi - đáp thông tin y tế với Trợ lý AI của BookingCare
                    </p>
                    <button
                      className="btn btn-info w-100"
                      onClick={this.handleStartAI}
                    >
                      Bắt đầu chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="related-articles">
            <div className="container py-5">
              <h2 className="section-title mb-4">Bài viết liên quan</h2>
              <div className="row">
                {relatedArticles.map((item, idx) => (
                  <div
                    className="col-lg-3 col-md-6 col-12 mb-4"
                    key={item.id || idx}
                  >
                    <div
                      className="article-card"
                      onClick={() =>
                        this.props.history.push(`/handbook/${item.id}`)
                      }
                    >
                      <div className="article-image">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="img-fluid"
                        />
                      </div>
                      <div className="article-content">
                        <div className="article-category">Cẩm nang</div>
                        <h5 className="article-title">{item.title}</h5>
                        <div className="article-meta">
                          <span>
                            <i className="fa fa-calendar me-1"></i>
                            {item.published || "Chưa có ngày"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(HandBookDetail);