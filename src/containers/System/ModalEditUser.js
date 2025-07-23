import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import _ from 'lodash';
class ModalEditUser extends Component {

    constructor(props){
        super(props);
        this.state = {
            id: '',
            email : '',
            firstName: '',
            lastName: '',
            passWord: '',
            address: '',
            phoneNumber: '',
            gender: '',
        }
    }

    componentDidMount() {
        let user = this.props.currentUser;
        console.log(user)
        if (user && !_.isEmpty(user)){
            this.setState({
                id: user.id,
                email : user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                passWord: '12345',
                address: user.address,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
            })
        }
    }

    toggle = () => {
        this.props.toogleFromParent();
    }
    handleOnChangeInput = (event, id) => {
        let coppyState = {...this.state};
    
        coppyState[id] = event.target.value
        this.setState({
            ...coppyState
        }
       
        )
    }
    checkValidateInput = () => {
        let isValid = true;
        let arrInput = [
            "id",
            "email",
            "firstName",
             "lastName",
            "passWord",
             "address",
            "phoneNumber",
            "gender",]
            for(let i=0; i<arrInput.length; i++){
                if(!this.state[arrInput[i]]){
                    isValid = false;
                    alert("Vui long nhap day du thong tin! " + arrInput[i]);
                    break;
                }
            }
        return isValid;
    }
    handleEditUsers = () => {
        let isValid = this.checkValidateInput();
        if(isValid===true){
            this.props.editUsers(this.state);
        }
        
    }
     
    render() {
        // console.log(this.props.isOpenModalEditUser)
        return (
            <Modal 
                show={this.props.isOpenModalEditUser}
                onHide={this.toggle}
                className={"modal-user-container"}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhập thông tin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="modal-user-body">
                        <input type="hidden"
                            
                                value={this.state.id}/>
                        
                           <div className="input-container">
                                <label htmlFor="inputEmail4">Email</label>
                                <input type="email" className="form-control" id="inputEmail4"  placeholder="Email..." 
                                onChange={(event)=>{this.handleOnChangeInput(event, "email")}}
                                value={this.state.email}
                                />
                            </div>
                        
                            <div className="input-container">
                                <label htmlFor="inputPassword">Mật khẩu</label>
                                <input type="text" className="form-control" id="inputPassword" name="passWord" placeholder="Mật khẩu..."  
                                 onChange={(event)=>{this.handleOnChangeInput(event, "passWord")}}
                                 value={this.state.passWord}
                                 />
                            </div>
                            
                            <div className="input-container">
                            <label htmlFor="inputFirstName">Họ</label>
                            <input type="text" className="form-control" id="inputFirstName" name="firstName" placeholder="Họ..." 
                             onChange={(event)=>{this.handleOnChangeInput(event, "firstName")}}
                             value={this.state.firstName}
                             />
                            </div>
                            <div className="input-container">
                                <label htmlFor="inputLastName">Tên</label>
                                <input type="text" className="form-control" id="inputLastName" name="lastName" placeholder="Tên..."
                                 onChange={(event)=>{this.handleOnChangeInput(event, "lastName")}}
                                 value={this.state.lastName}
                                  />
                            </div>
                   
                        
                            <div className="input-container">
                                <label htmlFor="inputPhoneNumber">Số điện thoại</label>
                                <input type="text" className="form-control" id="inputPhoneNumber" name="phoneNumber" placeholder="..." 
                                 onChange={(event)=>{this.handleOnChangeInput(event, "phoneNumber")}}
                                 value={this.state.phoneNumber}
                                 />
                            </div>
                            <div className="input-container">
                                <label htmlFor="inputGender">Giới tính</label>
                                <select id="inputGender" name="gender" className="form-control"
                                 onChange={(event)=>{this.handleOnChangeInput(event, "gender")}}
                                 value={this.state.gender}
                                >
                                    <option value="1">Nam</option>
                                    <option value="0">Nữ</option>
                                </select>
                            </div>
                            <div className="input-container max-width-input">
                                <label htmlFor="inputAddress">Địa chỉ</label>
                                <input type="text" className="form-control" id="inputAddress" name="address" placeholder="Địa chỉ..."  
                                 onChange={(event)=>{this.handleOnChangeInput(event, "address")}}
                                 value={this.state.address}
                                 />
                            </div>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={()=>{this.handleEditUsers()}}>
                    Cập nhập
                </Button>
                <Button variant="secondary" onClick={()=>{this.toggle()}}>
                    Hủy
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
