import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import React from "react";
import Slider from "react-slick";
class About extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="section-share section-about section-background">
          <div className="section-about-content">
            <div className="section-header">
              Truyền thông nói gì về Booking Care
            </div>
            <div className="section-body">
              <div className="content-left">
                <iframe
                  width="588"
                  height="330"
                  src="https://www.youtube.com/embed/FyDQljKtWnI"
                  title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
              </div>
              <div className="content-right">
                <div className="image-container">
                  <div className="image-about"></div>
                </div>
                <div className="image-container">
                  <div className="image-about"></div>
                </div>
                <div className="image-container">
                  <div className="image-about"></div>
                </div>
                <div className="image-container">
                  <div className="image-about"></div>
                </div>
                <div className="image-container">
                  <div className="image-about"></div>
                </div>
                <div className="image-container">
                  <div className="image-about"></div>
                </div>
                <div className="image-container">
                  <div className="image-about"></div>
                </div>
                <div className="image-container">
                  <div className="image-about"></div>
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
