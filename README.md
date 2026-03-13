# Divisum

Egy teljes körű Barbershop 1.0.6 menedzsment rendszer, amely tartalmaz backend API-t és Angular frontend alkalmazást.

## Tartalomjegyzék

- [Projekt Leírása](#projekt-leírása)
- [Technikai Verem](#technikai-verem)
- [Telepítés és Futtatás](#telepítés-és-futtatás)
- [Projekt Szerkezet](#projekt-szerkezet)
- [Funkciók](#funkciók)
- [Adatbázis](#adatbázis)
- [API Dokumentáció](#api-dokumentáció)
- [Biztonság](#biztonság)
- [Fejlesztési Útmutató](#fejlesztési-útmutató)

## Projekt Leírása

A Divisum egy modern, teljes körű Barbershop 1.0.6 management rendszer, amely lehetővé teszi a felhasználók számára a szolgáltatások foglalását, termékek vásárlását és profil kezelését. Az adminisztrátorok teljes hozzáféréssel rendelkeznek a rendszer kezeléséhez.

A rendszer két fő részből áll:
- **Backend**: Node.js/Express API szerver MariaDB adatbázissal
- **Frontend**: Angular 21 alapú felhasználói felület (Divisum)

## Technikai Verem

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize** - ORM MariaDB/MySQL-hez
- **MariaDB** - Adatbázis
- **JWT** - Hitelesítés
- **bcrypt** - Jelszó hash-elés
- **Multer** - Fájlfeltöltés
- **Nodemailer** - Email küldés

### Frontend
- **Angular 21.0.0** - Framework
- **TypeScript 5.9.2** - Programozási nyelv
- **Angular Material 21.0.3** - UI komponensek
- **Bootstrap 5.3.8** - CSS framework
- **RxJS 7.8.0** - Reaktív programozás
- **JWT Decode 4.0.0** - Token kezelés

## Telepítés és Futtatás

### Előfeltételek
- Node.js 18.x vagy magasabb
- npm 9.x vagy magasabb
- MariaDB/MySQL adatbázis XAMPP
- Angular CLI 21.x (frontendhez)

### Backend Telepítés

1. Navigálj a Backend mappába:
   ```bash
   cd Barbershop 1.0.6/Backend
   ```

2. Telepítsd a függőségeket:
   ```bash
   npm install
   ```

3. Hozz létre egy `.env` fájlt a gyökérben a következő tartalommal:
   ```
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=barbershopdb
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES=45m
   PORT=3000
   MAIL_HOST=your_mail_host
   MAIL_PORT=587
   MAIL_USER=your_mail_user
   MAIL_PASS=your_mail_password
   ```

4. Futtasd az adatbázis seedereket:
   ```bash
   npm run seed
   ```

5. Indítsd el a szervert:
   ```bash
   npm start
   ```

A backend elérhető lesz a `http://localhost:3000` címen.

### Frontend Telepítés

1. Navigálj a Frontend mappába:
   ```bash
   cd Barbershop 1.0.6/Frontend/Divisum
   ```

2. Telepítsd a függőségeket:
   ```bash
   npm install
   ```

3. Indítsd el a fejlesztési szervert:
   ```bash
   npm start
   ```

A frontend elérhető lesz a `http://localhost:4200` címen.

## Projekt Szerkezet

```
Barbershop 1.0.6/
├── Backend/
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── mail.js
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── foglalasController.js
│   │   │   ├── rendelesekController.js
│   │   │   ├── termekController.js
│   │   │   └── userController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── uploads.js
│   │   ├── models/
│   │   │   ├── foglalasModel.js
│   │   │   ├── relations.js
│   │   │   ├── rendelesekModel.js
│   │   │   ├── rendelesTermekekModel.js
│   │   │   ├── termekModel.js
│   │   │   └── userModel.js
│   │   ├── routes/
│   │   │   ├── foglalasRoute.js
│   │   │   ├── rendelesekRoute.js
│   │   │   ├── termekRoute.js
│   │   │   ├── uploadsRoute.js
│   │   │   └── userRoute.js
│   │   ├── seeders/
│   │   │   ├── adminSeeder.js
│   │   │   └── termekSeeder.js
│   │   └── utils/
│   │       └── jwtoken.js
│   ├── uploads/
│   │   ├── pfpicture/
│   │   └── termekek/
│   ├── txt_allomanyok/
│   │   ├── adatbazisterv.txt
│   │   ├── bibliografia.txt
│   │   ├── cmd parancsok.txt
│   │   ├── Dokumentáció.txt
│   │   ├── szótár.txt
│   │   └── Technikai_szojegyzek.md
│   ├── databaseRelations.erd
│   ├── package.json
│   └── README.md
└── Frontend/
    ├── Divisum/
    │   ├── src/
    │   │   ├── app/
    │   │   │   ├── adatvedelem/
    │   │   │   ├── admin/
    │   │   │   ├── admin-login/
    │   │   │   ├── aszf/
    │   │   │   ├── borbely-naptar/
    │   │   │   ├── delete-rendeles/
    │   │   │   ├── foglalas/
    │   │   │   ├── home/
    │   │   │   ├── kosar/
    │   │   │   ├── logged-profil/
    │   │   │   ├── login/
    │   │   │   ├── modify-delete-foglalas/
    │   │   │   ├── profil/
    │   │   │   ├── register/
    │   │   │   ├── services/
    │   │   │   └── termekek/
    │   │   ├── assets/
    │   │   │   └── images/
    │   │   ├── styles.css
    │   │   ├── custom-theme.scss
    │   │   ├── main.ts
    │   │   └── index.html
    │   ├── angular.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   └── README.md
    ├── frontend_documentation.md
    └── README.md
```

## Funkciók

### Felhasználói Funkciók
- Regisztráció és bejelentkezés
- Profil szerkesztés
- Foglalások kezelése (létrehozás, módosítás, törlés)
- Termékek böngészése és vásárlás
- Kosár kezelés
- Rendelés leadás és előzmények megtekintése

### Admin Funkciók
- Felhasználók kezelése
- Termékek kezelése
- Foglalások felügyelete
- Rendelések kezelése
- Rendszer beállítások

### Borbély Funkciók
- Saját naptár megtekintése
- Foglalások kezelése

##  Frontend Komponensek

A frontend Angular alkalmazás 32 komponensből áll, amelyek különböző funkciókat látnak el:

### Fő Komponensek
- **home/** - Kezdőlap, bemutatkozás és navigáció
- **login/** - Felhasználó bejelentkezés
- **register/** - Új felhasználó regisztráció
- **profil/** - Nyilvános profil információk
- **logged-profil/** - Bejelentkezett felhasználó profil kezelése
- **foglalas/** - Foglalások létrehozása
- **borbely-naptar/** - Naptár nézet foglalásokhoz
- **modify-delete-foglalas/** - Foglalások módosítása és törlése
- **termekek/** - Termékek böngészése
- **kosar/** - Kosár kezelése
- **delete-rendeles/** - Rendelés törlése
- **admin-login/** - Admin bejelentkezés
- **admin/** - Adminisztrációs panel
- **aszf/** - Általános szerződési feltételek
- **adatvedelem/** - Adatvédelmi nyilatkozat

### Szolgáltatások
- **kosar.services.ts** - Kosár kezelési szolgáltatások

### Architektúra
- **app-module.ts** - Fő alkalmazás modul
- **app-routing-module.ts** - Útválasztás kezelése
- **custom-theme.scss** - Angular Material téma
- **styles.css** - Globális stílusok
## Backend Architektúra

A backend Node.js/Express alapú API szerver, amely különböző modulokból áll:

### Kontrollerek
- **foglalasController.js** - Foglalások kezelése
- **rendelesekController.js** - Rendelések kezelése
- **termekController.js** - Termékek kezelése
- **userController.js** - Felhasználók kezelése

### Modellek
- **userModel.js** - Felhasználók adatmodell
- **foglalasModel.js** - Foglalások adatmodell
- **rendelesekModel.js** - Rendelések adatmodell
- **rendelesTermekekModel.js** - Rendelés-termék kapcsolatok
- **termekModel.js** - Termékek adatmodell
- **relations.js** - Adatbázis kapcsolatok

### Middleware-ek
- **authMiddleware.js** - JWT hitelesítés
- **uploads.js** - Fájlfeltöltés kezelése

### Útvonalak
- **foglalasRoute.js** - Foglalás végpontok
- **rendelesekRoute.js** - Rendelés végpontok
- **termekRoute.js** - Termék végpontok
- **uploadsRoute.js** - Fájlfeltöltés végpontok
- **userRoute.js** - Felhasználó végpontok

### Segédprogramok
- **jwtoken.js** - JWT token kezelés
- **adminSeeder.js** - Admin felhasználó feltöltés
- **termekSeeder.js** - Termékek feltöltés

### Konfiguráció
- **db.js** - Adatbázis kapcsolat
- **mail.js** - Email beállításo

A rendszer MariaDB/MySQL adatbázist használ Sequelize ORM-mel. Az adatbázis szerkezetét a `databaseRelations.erd` fájl tartalmazza.

### Fő Táblák
- **users** - Felhasználók
- **foglalasok** - Foglalások
- **rendelesek** - Rendelések
- **rendelesTermekek** - Rendelés-termék kapcsolatok
- **termekek** - Termékek

## API Dokumentáció

### Végpont Kategóriák
- **Autentikáció és felhazsnálók**: `/api/auth/*`
- **Foglalások**: `/api/foglalas/*`
- **Termékek**: `/api/termek/*`
- **Rendelések**: `/api/rendeles/*`
- **Admin**: `/api/admin/*`
- **Fájlfeltöltés**: `/api/uploads/*`

### HTTP Metódusok
- `GET` - Adatok lekérése
- `POST` - Új adat létrehozása
- `PUT` - Adat módosítása
- `DELETE` - Adat törlése

## Biztonság

- **JWT Token alapú hitelesítés**
- **bcrypt jelszó hash-elés**
- **Role alapú hozzáférés vezérlés** (User, Admin, Barber)
- **Middleware védelem** az API végpontokon
- **Fájlfeltöltés validáció**

## Fejlesztési Útmutató

### Backend Fejlesztés
- Használj ESLint-et kódminőség ellenőrzésre
- Prettier automatikus formázáshoz
- Nodemon fejlesztési szerverhez

### Frontend Fejlesztés
- Angular CLI használata
- Unit tesztek Vitest-tel
- Prettier kódformázáshoz

### Ajánlott VS Code Kiterjesztések
- ESLint
- Prettier
- Angular Language Service
- GitLens
- SQLTools (adatbázis kezeléshez)

## További Dokumentáció

- `Backend/txt_allomanyok/Technikai_szojegyzek.md` - Technikai fogalmak magyarázata
- `Frontend/frontend_documentation.md` - Frontend részletes dokumentáció
- `Backend/databaseRelations.erd` - Adatbázis séma diagram