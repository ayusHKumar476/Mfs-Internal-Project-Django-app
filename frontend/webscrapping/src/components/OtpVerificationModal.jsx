import { useState, useEffect } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

const OtpVerificationModal = ({ isOpen, onClose, onOtpSubmit }) => {
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");


  useEffect(() => {
    const storedUsername = sessionStorage.getItem("signup_username");

    if (storedUsername) {
      setUsername(storedUsername);
    }

  }, []);
  
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!otp) {
        alert("Please enter the OTP.");
        return;
      }

      await onOtpSubmit(otp);

    } catch (error) {
      console.error("Error handling OTP submission:", error);
      alert("An unexpected error occurred. Please try again.");
    } 
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>OTP Verification for {username}</h2>
      <p>Enter the OTP sent to your email:</p>
      <input type="text" value={otp} onChange={handleOtpChange} />
      <button onClick={handleSubmit}>Submit OTP</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

OtpVerificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOtpSubmit: PropTypes.func.isRequired,
};

export default OtpVerificationModal;
