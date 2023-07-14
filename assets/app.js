import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Switch, Route, withRouter, Redirect } from 'react-router-dom';
import './styles/bootstrap.min.css';
import './bootstrap';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import authApi from './services/authApi';
import AuthContext from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import CustomerPage from './pages/CustomerPage';

authApi.setup();

//localhost:8000/customers en normal mais avec HashRouterce sera localhost/#/customers

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        authApi.isAuthenticated());

    console.log(isAuthenticated);
    const NavBarWithRouter = withRouter(NavBar);


    return (
        <AuthContext.Provider value={{isAuthenticated,setIsAuthenticated}}>
            <HashRouter>
                <NavBarWithRouter />
                <main className="container pt-5"> 
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <PrivateRoute path="/customers/:id" component={CustomerPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
}

const rootElement = document.querySelector("#app");
ReactDOM.createRoot(rootElement).render(<App />);