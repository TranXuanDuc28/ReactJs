// Không cần import Material-UI nữa

const Header = ({ user }) => {
  return (
    <div className="card rounded-0 border-0 mb-2">
      <div className="card-body py-2 px-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mr-2" style={{width: 40, height: 40, fontSize: 20}}>
            {user.firstName?.charAt(0) || 'U'}
          </div>
          <div className="ml-2">
            <div className="font-weight-bold">{user.firstName + " " + user.lastName}</div>
            <div className="text-muted" style={{fontSize: 12}}>{user.email}</div>
          </div>
        </div>
        <button className="btn btn-link p-0 text-secondary" tabIndex={-1}>
          <i className="fa fa-ellipsis-v" />
        </button>
      </div>
    </div>
  );
};

export default Header;
