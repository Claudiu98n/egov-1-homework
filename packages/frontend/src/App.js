import './App.css';

// react-router-dom
import { Switch, Route } from 'react-router-dom';

// pages
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import ContextLoader from './pages/buyTickets/ContextLoader';

// private-route
import PrivateRoute from './components/privateRoute/PrivateRoute';

function App() {
  return (
    <main className="App">
      <Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/sign-up" exact component={SignUp} />
        <PrivateRoute component={ContextLoader} path="/buy-tickets" exact />
      </Switch>
    </main>
  );
}

export default App;
