exports.loginUser = async (req, res) => {
  const { email, role, password } = req.body;
  console.log(req.body);

  // Validate allowed roles
  const allowedRoles = ['Retailer', 'Ad-Agency'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      message: 'Invalid role. Only Retailer and Ad-Agency roles are allowed.',
      data: null,
      success: false,
      error: 'InvalidRole'
    });
  }

  try {
    const user = await User.findOne({ where: { email, role } });
    console.log(user);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found with this email and role.',
        data: null,
        success: false,
        error: 'UserNotFound'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        message: 'Your account has not been approved yet.',
        data: null,
        success: false,
        error: 'AccountNotApproved'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid Credentials.',
        data: null,
        success: false,
        error: 'InvalidPassword'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Something went wrong while logging in.',
      data: null,
      success: false,
      error: 'ServerError'
    });
  }
};
