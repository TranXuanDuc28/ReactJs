import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../CustomArrows";
import axios from "axios";
import { getAllHandBook } from "../../../services/userServices";

class HandBook extends Component {
  state = {
    handbooks: [],
    loading: true,
  };

  async componentDidMount() {
    try {
      const res = await getAllHandBook();
      this.setState({ handbooks: res.data || [], loading: false });
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  handleClickHandBook = (id) => {
    this.props.history.push(`/handbook/${id}`);
  };

  render() {
    const { handbooks, loading } = this.state;

    return (
      <React.Fragment>
        <div className="section-share section-handlebook">
          <div className="section-content">
            <div className="section-header">
              <div className="title-section"> Cẩm nang</div>
              <div>
                <button className="btn-section">Xem thêm</button>
              </div>
            </div>
            <div className="section-body">
              {loading ? (
                <div>Đang tải...</div>
              ) : (
                <Slider
                  {...this.props.settings}
                  nextArrow={<NextArrow />}
                  prevArrow={<PrevArrow />}
                >
                  {handbooks.map((item) => (
                    <div
                      className="section-customize"
                      key={item.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => this.handleClickHandBook(item.id)}
                    >
                      <div
                        className="bg-image section-handlebook"
                        style={{
                          backgroundImage: `url(${item.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          height: 180,
                          borderRadius: 12,
                        }}
                      ></div>
                      <div className="title-section">{item.title}</div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  (state) => ({ isLoggedIn: state.user.isLoggedIn }),
  null
)(withRouter(HandBook));
