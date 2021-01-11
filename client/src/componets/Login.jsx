import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../cover.css';

function Login() {
    // Converted from Master branch
    document.body.style.height = "100vh";
    return (
        <div className="text-center cover-container d-flex h-100 p-3 mx-auto flex-column">
          <header className="masthead mb-auto">
            <div className="inner">
              <h3 className="masthead-brand">SteamPals.io</h3>
              <nav className="nav nav-masthead justify-content-center">
                <a className="nav-link active" href="/">Home</a>
                <a className="nav-link" href="https://github.com/daniel-lynch/steampals">GitHub</a>
              </nav>
            </div>
          </header>
          <main role="main" className="inner cover">
            <h1 className="cover-heading">Welcome to SteamPals!</h1>
            <p className="lead">Don't know what to play with your friends? How about see what games you and all your friends have in common!</p>
            <p className="lead">
            </p>
            <br />
            <form id="signinForm" action="http://api.steampals.io/auth/openid" method="post">
              <input name="submit" type="image" height="35px" src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" alt="Sign in through Steam" />
            </form>
            <p />
          </main>
          <footer className="mastfoot mt-auto">
            <div className="inner">
              <p>SteamPals - Early Access - Developed by <a href="https://www.linkedin.com/in/daniel-lynch-016448124/">@daniel-lynch</a>, <a href="https://linkedin.com/in/anthony-loukinas">@anthonyloukinas</a>.</p>
            </div>
          </footer>
        </div>
      );
}

export default Login