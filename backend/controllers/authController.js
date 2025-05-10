const bcrypt = require('bcrypt');
const { User } = require('../models');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid username' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

  req.session.userId = user.userid;
  res.json({ message: 'Login successful', userId: user.userid });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
};

exports.getCurrentUser = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  const user = await User.findByPk(req.session.userId, { attributes: ['userid', 'username', 'email'] });
  res.json(user);
};