import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import ComprehensiveService from "./Section/ComprehensiveService";
import Specialty from "./Section/Specialty";
import MedicalFacility from "./Section/MedicalFacility";
import OutstandingDoctor from "./Section/OutstandingDoctor";
import HandBook from "./Section/HandBook";
import About from "./Section/About";
import HomeFooter from "./HomeFooter";
import AIAssistant from "./AIAssistant";
import "./HomePage.scss";
class HomePage extends Component {
  render() {
    const { isLoggedIn } = this.props;
    let linkToRedirect = isLoggedIn ? "/system/user-manage" : "/home";
    let settings = {
      // dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    };
    return (
      <div>
        <HomeHeader isShowBanner={true} />
        <ComprehensiveService />
        <Specialty settings={settings} />
        <MedicalFacility settings={settings} />
        <OutstandingDoctor settings={settings} />
        <HandBook settings={settings} />
        <About />
        <HomeFooter />
        <AIAssistant />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
