import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul>
            <li className="mb-2"><a href="#" className="hover:underline">Home</a></li>
            <li className="mb-2"><a href="#" className="hover:underline">About</a></li>
            <li className="mb-2"><a href="#" className="hover:underline">Services</a></li>
            <li className="mb-2"><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul>
            <li className="mb-2 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              1234 Street Name, City, State, 12345
            </li>
            <li className="mb-2 flex items-center">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              (123) 456-7890
            </li>
            <li className="mb-2 flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              email@example.com
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400">
              <FontAwesomeIcon icon={faFacebook} size="2x" />
            </a>
            <a href="#" className="hover:text-gray-400">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
            <a href="#" className="hover:text-gray-400">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;