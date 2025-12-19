import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import '../style/Footer.css';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="footer-links">
        <div>
          <img src="https://res.cloudinary.com/dywqgsjss/image/upload/v1765891545/3e445f17-5be3-4088-a810-d1015e2aeb2b_jgwlxm.png" alt="eshop-lb" />
        </div>
        <div>
          <h3>SHOP NOW</h3>
          <ul>
            <li><Link to="/clothing">CLOTHING</Link></li>
            <li><Link to="/swimwear">SWIMWEAR</Link></li>
            <li><Link to="/accessories">ACCESSORIES</Link></li>
            <li><Link to="/sale">SALE</Link></li>

          </ul>
        </div>
        <div>
          <h3>USEFUL LINKS</h3>
          <ul>
            <li><a href="#">My account</a></li>
            <li><a href="#">Get in Touch</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </div>
        <div>
          <h3>STAY UP-TO-DATE</h3>
          <form>
            <input type="email" placeholder="Your email address" />
            <button type="submit">SIGN UP</button>
          </form>
          <div className="social-links">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} color="white" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} color="white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;