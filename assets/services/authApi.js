import axios from 'axios';
import jwtDecode from 'jwt-decode';
let token;

function authenticate(credentials) {
    return axios.post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            //stocker le token dans le local storage
            window.localStorage.setItem("authToken", token);
            //previent axios qu'on a un header par default sur toutes les futures requette http
            setAxiosToken(token);
        });
}

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;  // viisible sur postman
}
function setup() {
    //voir si on a un token 
    const token = window.localStorage.getItem("authToken");
    //si on a un token valide 
    if (token) {
        const jwtData = jwtDecode(token)
        // console.log(jwtData)
        if (jwtData.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);  // viisible sur postman
            console.log('connex ok')
        } 
    }
    //donner le token à axios
}
function isAuthenticated() {
        //voir si on a un token 
        const token = window.localStorage.getItem("authToken");
        //si on a un token valide 
        if (token) {
            const jwtData = jwtDecode(token)
            // console.log(jwtData)
            if (jwtData.exp * 1000 > new Date().getTime()) {
               return true;
            }
            return false;
        }
        return false;
}

export default {
    setup,
    authenticate,
    logout,
    isAuthenticated
};