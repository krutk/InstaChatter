import { Route } from "react-router-dom";
import Home from "./Pages/Home";
import Chat from "./Pages/Chat";
function App() {
  return (
    <div>
      {/* <Routes> */}
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chat} />
      {/* </Routes> */}
    </div>
  );
}

export default App;
