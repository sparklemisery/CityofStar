import { Route, Routes, Link } from "react-router-dom"
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";




function App() {


  return (


    <div className="">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>

  );
}

export default App;
