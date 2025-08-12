import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import Header from "../../Header/Header";

// Import available specialty icons
import coXuongKhop from "../../../assets/images/101627-co-xuong-khop.png";
import thanKinh from "../../../assets/images/101739-than-kinh.png";
import tieuHoa from "../../../assets/images/101713-tieu-hoa.png";
import timMach from "../../../assets/images/101713-tim-mach.png";
import taiMuiHong from "../../../assets/images/101713-tai-mui-hong.png";
import cotSong from "../../../assets/images/101627-cot-song.png";
import cotruyen from "../../../assets/images/101739-y-hoc-co-truyen.png";
import chamcuu from "../../../assets/images/101627-cham-cuu.png";
import sanphukhoa from "../../../assets/images/101713-san-phu-khoa.png";
import nhikhoa from "../../../assets/images/101655-nhi-khoa.png";
import dalieu from "../../../assets/images/101638-da-lieu.png";
import phuchoichucnang from "../../../assets/images/101713-phuc-hoi-chuc-nang.png";
import HomeHeader from "../../HomePage/HomeHeader";

// Placeholder icons for missing ones
const placeholderIcon =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzgiIGZpbGw9IiM0MDk5YTQiIG9wYWNpdHk9IjAuMSIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzMCIgZmlsbD0iIzQwOTlhNCIgb3BhY2l0eT0iMC4yIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIyIiBmaWxsPSIjNDA5OWE0IiBvcGFjaXR5PSIwLjMiLz4KPC9zdmc+";

class SpecialtyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialties: [
        {
          id: 1,
          name: "Cơ Xương Khớp",
          icon: coXuongKhop,
          description: "Chuyên điều trị các bệnh về xương khớp, cơ bắp",
        },
        {
          id: 2,
          name: "Thần kinh",
          icon: thanKinh,
          description: "Chuyên điều trị các bệnh về hệ thần kinh",
        },
        {
          id: 3,
          name: "Tiêu hóa",
          icon: tieuHoa,
          description: "Chuyên điều trị các bệnh về đường tiêu hóa",
        },
        {
          id: 4,
          name: "Tim mạch",
          icon: timMach,
          description: "Chuyên điều trị các bệnh về tim mạch",
        },
        {
          id: 5,
          name: "Tai Mũi Họng",
          icon: taiMuiHong,
          description: "Chuyên điều trị các bệnh về tai, mũi, họng",
        },
        {
          id: 6,
          name: "Cột sống",
          icon: cotSong,
          description: "Chuyên điều trị các bệnh về cột sống",
        },
        {
          id: 7,
          name: "Y học Cổ truyền",
          icon: cotruyen,
          description: "Điều trị bằng phương pháp y học cổ truyền",
        },
        {
          id: 8,
          name: "Châm cứu",
          icon: chamcuu,
          description: "Điều trị bằng phương pháp châm cứu",
        },
        {
          id: 9,
          name: "Sản Phụ khoa",
          icon: sanphukhoa,
          description: "Chuyên điều trị các bệnh phụ khoa",
        },
        {
          id: 10,
          name: "Nhi khoa",
          icon: nhikhoa,
          description: "Chuyên điều trị các bệnh ở trẻ em",
        },
        {
          id: 11,
          name: "Da liễu",
          icon: dalieu,
          description: "Chuyên điều trị các bệnh về da",
        },
        {
          id: 12,
          name: "Phục hồi chức năng",
          icon: phuchoichucnang,
          description: "Chuyên điều trị các bệnh về da",
        },
      ],
    };
  }

  handleSpecialtyClick = (specialty) => {
    // Navigate to specialty detail page
    this.props.navigate(`/detail-specialty/${specialty.id}`);
  };

  render() {
    return (
      <div className="bg-light min-vh-100">
        <HomeHeader isShowBanner={false} />

        <div className="container py-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <i className="fa fa-home text-primary me-2"></i>
                <span className="text-primary">Khám Chuyên khoa</span>
              </li>
            </ol>
          </nav>

          {/* Page Title */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-dark mb-3">
              Khám Chuyên khoa
            </h1>
            <p
              className="lead text-muted mx-auto"
              style={{ maxWidth: "600px" }}
            >
              Tìm bác sĩ theo chuyên khoa phù hợp với tình trạng sức khỏe của
              bạn
            </p>
          </div>

          {/* Specialties Grid */}
          <div className="row g-4 mb-5">
            {this.state.specialties.map((specialty) => (
              <div
                key={specialty.id}
                className="col-lg-3 col-md-4 col-sm-6 col-12"
              >
                <div
                  className="card h-100 border-0 shadow-sm specialty-card"
                  onClick={() => this.handleSpecialtyClick(specialty)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    background:
                      "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
                  }}
                >
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <div
                        className="mx-auto d-flex align-items-center justify-content-center"
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "radial-gradient(circle, #ffd354, #ffe7c3, #fefdfb, #ffffff)",
                          borderRadius: "50%",
                          border: "2px solid #e9ecef",
                        }}
                      >
                        <img
                          src={specialty.icon}
                          alt={specialty.name}
                          className="img-fluid"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    </div>
                    <h5 className="card-title fw-bold text-dark mb-2">
                      {specialty.name}
                    </h5>
                    <p className="card-text text-muted small mb-0">
                      {specialty.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Button */}
        <div
          className="position-fixed d-flex flex-column align-items-center"
          style={{
            bottom: "30px",
            right: "30px",
            zIndex: 1000,
            cursor: "pointer",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-center mb-2"
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #4099a4, #2c7be5)",
              borderRadius: "50%",
              boxShadow: "0 4px 15px rgba(64, 153, 164, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(64, 153, 164, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(64, 153, 164, 0.3)";
            }}
          >
            <i
              className="fa fa-robot text-white"
              style={{ fontSize: "24px" }}
            ></i>
          </div>
          <span className="text-primary fw-bold small">Trợ lý AI</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyPage);
