import { useHistory } from "react-router-dom";

const Profile = ({ user }) => {
  console.log("user profile", user)
  const history = useHistory();
  const logOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    history.push("/")
  };
  return (
    <div className="h-100 w-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card text-center w-100" style={{maxWidth: 400, margin: '0 auto', background: '#eee'}}>
        <div className="card-body d-flex flex-column align-items-center">
          <img
            src={user.image}
            alt="avatar"
            className="rounded-circle mb-3"
            style={{ width: 120, height: 120, objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
          <h4 className="text-uppercase text-primary mb-2">{user.firstName+" "+user.lastName}</h4>
          <div className="mb-1">{user.roleData.valueVi}</div>
          <div className="mb-3 text-muted">{user.email}</div>
          {/* <button onClick={logOut} className="btn btn-secondary">LOGOUT</button> */}
        </div>
      </div>
    </div>
  );
};
export default Profile;
