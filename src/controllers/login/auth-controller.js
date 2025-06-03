const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Account } = require('../../models');

const SECRET = process.env.JWT_SECRET || 'secretkey';

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const user = await Account.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1d' });

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
  });
};
