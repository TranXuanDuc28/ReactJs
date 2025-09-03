import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import React from "react";
import Slider from "react-slick";
import anh1 from "../../../assets/images/about/images.png";
import anh2 from "../../../assets/images/about/images (1).png";
import anh3 from "../../../assets/images/about/vietnam-television-vtv8-logo-png_seeklogo-554877.png";
import anh4 from "../../../assets/images/about/vtv-cn-th-logo-png_seeklogo-503391.png";
import anh5 from "../../../assets/images/about/xem-tivi-vtv6-2.png";
import anh6 from "../../../assets/images/about/vtv2-logo.jpg";
import { FormattedMessage } from "react-intl";

class About extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="section-share section-about section-background">
          <div className="section-about-content">
            <div className="section-header">
              <FormattedMessage id="homepage.about" />
            </div>
            <div className="section-body">
              <div className="content-left">
                <div className="video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/FyDQljKtWnI"
                    title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="content-right">
                <div className="image-container">
                  <div
                    className="image-about"
                    style={{
                      backgroundImage: `url(${anh1})`,
                    }}
                  ></div>
                </div>
                <div className="image-container">
                  <div
                    className="image-about"
                    style={{
                      backgroundImage: `url(${anh2})`,
                    }}
                  ></div>
                </div>
                <div className="image-container">
                  <div
                    className="image-about"
                    style={{
                      backgroundImage: `url(${anh3})`,
                    }}
                  ></div>
                </div>
                <div className="image-container">
                  <div
                    className="image-about"
                    style={{
                      backgroundImage: `url(${anh4})`,
                    }}
                  ></div>
                </div>
                <div className="image-container">
                  <div
                    className="image-about"
                    style={{
                      backgroundImage: `url(${anh5})`,
                    }}
                  ></div>
                </div>
                <div className="image-container">
                  <div
                    className="image-about"
                    style={{
                      backgroundImage: `url(${anh6})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
