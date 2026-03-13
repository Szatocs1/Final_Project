//Ez egy segítség a frontra
import jwtDecode from "jwt-decode";

const token = localStorage.getItem("token");

if (token) {
  const decoded = jwtDecode(token);

  console.log(decoded);
  // { userId: 1, isAdmin: true, iat: ..., exp: ... }

  if (decoded.isAdmin) {
    // show admin UI
  }
}

