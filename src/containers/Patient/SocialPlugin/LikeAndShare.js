import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
class LikeAndShare extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  initFacebookSDK() {
    console.log(">>> Init Facebook SDK với locale:", this.props.language);

    // Xoá script cũ (nếu có)
    const oldScript = document.getElementById("facebook-jssdk");
    if (oldScript) {
      oldScript.parentNode.removeChild(oldScript);
      console.log(">>> Đã xoá facebook-jssdk cũ");
    }

    // Xoá fb-root cũ (nếu có)
    const oldRoot = document.getElementById("fb-root");
    if (oldRoot) {
      oldRoot.parentNode.removeChild(oldRoot);
      console.log(">>> Đã xoá fb-root cũ");
    }

    // Thêm fb-root mới
    const fbRoot = document.createElement("div");
    fbRoot.id = "fb-root";
    document.body.appendChild(fbRoot);
    console.log(">>> Đã thêm fb-root mới");

    // Gắn window.fbAsyncInit TRƯỚC khi thêm script
    window.fbAsyncInit = function () {
      console.log(">>> window.fbAsyncInit chạy");
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v17.0",
      });
      window.FB.AppEvents.logPageView();
    };

    // Tạo script mới với ngôn ngữ
    let locale = this.props.language === "vi" ? "vi_VN" : "en_US";
    console.log("locale", locale);

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = `https://connect.facebook.net/${locale}/sdk.js`;

    // Đảm bảo parse lại sau khi SDK load
    script.onload = () => {
      console.log(">>> SDK loaded, gọi FB.XFBML.parse()");
      if (window.FB) {
        window.FB.XFBML.parse();
      }
    };

    document.body.appendChild(script);
    console.log(">>> Đã thêm script facebook-jssdk mới:", script.src);
  }

  componentDidMount() {
    this.initFacebookSDK();
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      this.initFacebookSDK();
    }
  }

  render() {
    let { dataHref } = this.props;

    return (
      <div
        className="fb-like"
        data-href={dataHref}
        data-width=""
        data-layout="button_count" // Thay vì "standard"
        data-action="like"
        data-size="small"
        data-share="true"
      ></div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LikeAndShare);
