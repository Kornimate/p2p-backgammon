import Connectivity from './components/Connectivity';
import SignIn from './components/pages/SignIn';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import SignUp from './components/pages/SignUp';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path='/' element={<SignIn />}/>
            <Route path='/connection' element={<Connectivity />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
