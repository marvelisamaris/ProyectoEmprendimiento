const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const { firstname, documnt } = req.body; // Obtener los campos adicionales desde la solicitud
  
  const user = await User.findOne({ 'email': email });
  console.log(user)
  if (user) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.firstname = firstname; // Asignar el valor de firstname
    newUser.documnt = documnt; // Asignar el valor de documnt
    console.log(newUser)
    await newUser.save();
    return done(null, newUser);
  }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({email: email});
  if(!user) {
    return done(null, false, req.flash('signinMessage', '¡Usuario incorrecto!'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', '¡Contraseña incorrecta!'));
  }
  return done(null, user);
}));

