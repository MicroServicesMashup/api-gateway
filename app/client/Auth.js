export default {
  login(token) {
    if(sessionStorage.token){
      return this.onChange(true);
    }

    if(token){
      sessionStorage.token = token;
      return this.onChange(true);
    }

    if(!token){
      delete sessionStorage.token;
      this.onChange(false);
    }
  },

  getToken() {
    return sessionStorage.token
  },

  logout() {
    delete sessionStorage.token;
    this.onChange(false);
  },

  loggedIn() {
    return sessionStorage.token;
  },

  onChange() {}
}
