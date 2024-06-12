import "./Footer.scss";
import logo from "../../assets/Logo-Light-Theme.png";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="subscribe">
            <div className="subscribeContent">
              <i className="fa-regular fa-envelope"></i>
              <h2>Subscribe now to get latest updates</h2>
            </div>
            <div className="subscribeForm">
              <input type="email" placeholder="Email Address" />
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
          <div className="footerContent">
            <div className="footerOne">
              <img src={logo} alt="logo" />
              <p>
                Desires to obtain pain of itself, because it is pain, but
                occasionally circumstances.
              </p>
              <div className="socialMedia">
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-twitter"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin"></i>
              </div>
            </div>

            <div className="footerTwo">
              <h2>Explore</h2>
              <ul>
                <li>Home</li>
                <li>Services</li>
                <li>Blog</li>
                <li>Gallery</li>
                <li>Contact</li>
              </ul>
            </div>

            <div className="footerThree">
              <h2>Portfolio</h2>
              <div className="portfolio"></div>
            </div>

            <div className="footerFour">
              <h2>Contact</h2>
              <address>123, New Lenox Chicago, IL 60606</address>
              <div className="contact">
                <div className="email">
                  <i className="fa-regular fa-envelope"></i>
                  <p>needhelp@company.com</p>
                </div>
                <div className="phone">
                  <i className="fa-solid fa-phone-volume"></i>
                  <p>+123 456 7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
