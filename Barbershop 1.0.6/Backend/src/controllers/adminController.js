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

//Legyen-e borbély felület, ahol mutattja az összes foglalást a borbélynak? Ha igen, akkor ellenőrzi a foglalás idejét és ha még időben van, tehát nem a múltban lévő foglalás-e. Ha még érvényes, akkor kiírja.
//Két komponens kell még legalább: foglalás törlés és módosítás, illetve a rendelés törlés -> {
//  ez már kész van, már csak az emailt kell csinálni.
//}
//Admin debugok, hogy jól nézzen ki.
//Admin módosítás törlés