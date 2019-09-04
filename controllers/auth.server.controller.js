/**
 * Auth Server Controller
 * Handles logic for all routes matching "/auth"
 * @author Anthony Loukinas <anthony.loukinas@redhat.com>
 */

/**
 * Handles logic for "/auth/openid/return".
 * Currently we are handling routing to your default route based
 * on what user type you are.
 * @param req - Express Request
 * @param res - Express Response
 */
exports.getReturn = (req, res) => {
  if (req.user) {
    res.redirect('/?steamid=' + req.user.steamId);
  } else {
    res.redirect('/?failed');
  }
}

exports.getLogout = (req, res) => {
  req.logout();
  res.redirect(req.get('Referer') || '/');
}

exports.getLogin = (req, res) => {
  res.render('login');
}