import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import  './HomeHeader.scss';
import logo1 from '../../assets/images/161905-iconkham-chuyen-khoa.webp';
import logo2 from '../../assets/images/161817-iconkham-tu-xa.webp';
import logo3 from '../../assets/images/161350-iconkham-tong-quan.webp';
import logo4 from '../../assets/images/161340-iconxet-nghiem-y-hoc.webp';
import logo5 from '../../assets/images/161403-iconsuc-khoe-tinh-than.webp';
import logo6 from '../../assets/images/161410-iconkham-nha-khoa.webp';
import logo7 from '../../assets/images/161421-icongoi-phau-thuat.webp';
import logo8 from '../../assets/images/145257-thiet-ke-chua-co-ten-3.webp';
import logo9 from '../../assets/images/161442-iconbai-test-suc-khoe2.webp';
import logo10 from '../../assets/images/163421-153524-near-home-01.webp';
import { FormattedMessage } from 'react-intl';
import {LANGUAGE} from "../../utils";
import {changeLanguage} from "../../store/actions/appActions"
class HomeHeader extends Component {
    handleChangeLanguage = (language) => {
        this.props.changeLanguageRedux(language);
    }
    render() {
        let language = this.props.language
        return (
            <React.Fragment>
                
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <button><i class="fa fa-bars" aria-hidden="true"></i></button>
                            <div className='header-logo ' onClick={() => this.props.navigate('/home')}>
                                
                            </div>
                        </div>
                        <div className='center-content'>
                            <div className='left-child-content'>
                                <div className='subs-title1 subs-title1-yellow'>Tất cả</div>
                                <div className='subs-title1'>Tại nhà</div>
                                <div className='subs-title1'>Tại viện</div>
                                <div className='subs-title1'>Sống khỏe</div>
                            </div>
                            <div className='right-child-content'>
                                <div className='search-input'>
                                    <i class="fa fa-search" aria-hidden="true"></i>
                                    <input type='text' placeholder='Tìm gói khám tổng quát'/>
                                </div>
                               
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='schedule'>
                               <i class="fa fa-calendar" aria-hidden="true"></i>
                               <div className='subs-title2'>Lịch hẹn</div>
                            
                            </div>
                            <div className='chat'>
                               <i class="fa fa-comments" aria-hidden="true"></i>
                               <div className='subs-title2' onClick={() => this.props.navigate('/chat-patient')}>Chat với Bác sĩ</div>
                            
                            </div>
                            <div className='support'>
                               <i class="fa fa-question-circle" aria-hidden="true"></i>
                               <div className='subs-title2'><FormattedMessage id = "homeheader.support"/></div>
                            </div>
                            <div className='language'>
                               <div className={language === LANGUAGE.VI ? 'subs-title2 active-vi' : 'subs-title2'}><span  onClick={() => this.handleChangeLanguage(LANGUAGE.VI)}>VI</span></div>
                               <div className={language === LANGUAGE.EN ? 'subs-title2 active-en' : 'subs-title2'} ><span  onClick={() => this.handleChangeLanguage(LANGUAGE.EN)}>EN</span></div>
                            
                            </div>
                        </div>
                    </div>
                    {this.props.isShowBanner===true && 
                      <div className='home-banner-content'></div>
                    }
                  

                </div>
                {this.props.isShowBanner===true && 
                   <div className='home-body1-container'>
                   <div className='subs-title'>Dịch vụ toàn diện</div>
                   <div className='home-body1-content'>
                       
                       <div className='child-content'>
                           <div className='image-container'><img src={logo1}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo2}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo3}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo4}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo5}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo6}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo7}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo8}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo9}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                       <div className='child-content'>
                           <div className='image-container'><img src={logo10}/></div>
                           <div className='child-subs-title'><FormattedMessage id = "homeheader.speciality"/></div>
                       </div>
                   
                   </div>

               </div>  
                }
                
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageRedux: (language) => dispatch(changeLanguage(language)),
        navigate: (path) => dispatch(push(path))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);