const User = require("./user");
const Rendelesek = require("./rendelesek");
const Foglalasok = require("./foglalasok");
const Termekek = require("./termekek");
const RendelesTermekek = require("./rendelesTermekekModel");

User.hasMany(Rendelesek, { foreignKey: 'userId', as: 'orders' });
Rendelesek.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Foglalasok, { foreignKey: 'userId', as: 'appointments' });
Foglalasok.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Rendelesek.hasMany(RendelesTermekek, { foreignKey: 'rendelesId', as: 'items' });
RendelesTermekek.belongsTo(Rendelesek, { foreignKey: 'rendelesId', as: 'order' });

Termekek.hasMany(RendelesTermekek, { foreignKey: 'termekId', as: 'usedInOrders' });
RendelesTermekek.belongsTo(Termekek, { foreignKey: 'termekId', as: 'product' });

Rendelesek.belongsToMany(Termekek, {
  through: RendelesTermekek,
  foreignKey: 'rendelesId',
  otherKey: 'termekId',
  as: 'products'
});

Termekek.belongsToMany(Rendelesek, {
  through: RendelesTermekek,
  foreignKey: 'termekId',
  otherKey: 'rendelesId',
  as: 'orders'
});
