// Không cần import Material-UI nữa

const Header = ({ roomData }) => {
  return (
    <div className="card rounded-0 border-0 mb-2 bg-light-custom">
      <div className="card-body py-2 px-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          {/* <button className="btn btn-link p-0 mr-2" tabIndex={-1}>
            <i className="fa fa-arrow-left" />
          </button> */}
          <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mr-2" style={{width: 40, height: 40, fontSize: 20}}>
            {roomData.receiver.firstName?.charAt(0) || 'U'}
          </div>
          <div className="px-2">
        <div className="font-weight-bold">{roomData.receiver.firstName+" "+roomData.receiver.lastName}</div>
        <div className="text-muted" style={{fontSize: 12}}>{roomData.receiver.email}</div>
      </div>
        </div>
        <div className="d-flex align-items-center">
          <button className="btn btn-link p-0 mr-2" tabIndex={-1}>
            <i className="fa fa-video-camera" />
          </button>
          <button className="btn btn-link p-0" tabIndex={-1}>
            <i className="fa fa-phone" />
          </button>
        </div>
      </div>
     
    </div>
  );
};
export default Header;
