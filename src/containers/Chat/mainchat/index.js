import Header from "./Header";
import ChatArea from "./ChatArea";
import Footer from "./Footer";

const ChatBox = ({ roomData, handleSendMsg, allMsg, user, handleDelete, loadMoreMsg }) => {
  return (
    <div className="d-flex flex-column h-100 w-100">
      {roomData.room ? (
        <>
          <Header roomData={roomData} />
          <ChatArea allMsg={allMsg} user={user} handleDelete={handleDelete} loadMoreMsg={loadMoreMsg} />
          <Footer handleSendMsg={handleSendMsg} />
        </>
      ) : (
        <div className="p-3 text-center">Please select a user to chat</div>
      )}
    </div>
  );
};
export default ChatBox;
