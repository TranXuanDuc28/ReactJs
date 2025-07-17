import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import React from "react";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../CustomArrows";
class HandBook extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="section-share section-handlebook">
          <div className="section-content">
            <div className="section-header">
              <div className="title-section"> Cẩm nang</div>
              <div>
                {" "}
                <button className="btn-section">Xem thêm</button>
              </div>
            </div>
            <div className="section-body">
              <Slider
                {...this.props.settings}
                nextArrow={<NextArrow />}
                prevArrow={<PrevArrow />}
              >
                <div className="section-customize">
                  <div className="bg-image section-handlebook"></div>
                  <div className="title-section">
                    7 địa chỉ khám và điều trị cong vẹo cột sống trẻ em uy tín
                    tại Hà Nội{" "}
                  </div>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handlebook"></div>
                  <div className="title-section">
                    7 địa chỉ khám và điều trị cong vẹo cột sống trẻ em uy tín
                    tại Hà Nội{" "}
                  </div>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handlebook"></div>
                  <div className="title-section">
                    7 địa chỉ khám và điều trị cong vẹo cột sống trẻ em uy tín
                    tại Hà Nội{" "}
                  </div>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handlebook"></div>
                  <div className="title-section">
                    7 địa chỉ khám và điều trị cong vẹo cột sống trẻ em uy tín
                    tại Hà Nội{" "}
                  </div>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handlebook"></div>
                  <div className="title-section">
                    7 địa chỉ khám và điều trị cong vẹo cột sống trẻ em uy tín
                    tại Hà Nội{" "}
                  </div>
                </div>
                <div className="section-customize">
                  <div className="bg-image section-handlebook"></div>
                  <div className="title-section">
                    7 địa chỉ khám và điều trị cong vẹo cột sống trẻ em uy tín
                    tại Hà Nội{" "}
                  </div>
                </div>
              </Slider>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
