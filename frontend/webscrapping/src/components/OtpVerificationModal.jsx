import { useState } from "react";
// import Modal from "react-modal";
import PropTypes from "prop-types";

const OtpVerificationModal = ({ isOpen, onClose, onOtpSubmit, username }) => {
  const [otp, setOtp] = useState("");

  // useEffect(() => {
  //   const storedUsername = sessionStorage.getItem("username");

  //   if (storedUsername) {
  //     setUsername(storedUsername);
  //   }
  // }, []);

  // console.log("otp", otp)
  // console.log("isopen", isOpen)
  // console.log("username", username)
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!otp) {
        alert("Please enter the OTP.");
        return;
      }

      const response = await onOtpSubmit(otp);
      if (response) sessionStorage.setItem("isAuthencticated", true);
    } catch (error) {
      console.error("Error handling OTP submission:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className="modal"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="exampleModalLabel">
              OTP Verification for {username}
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>Enter the OTP sent to your email:</p>
            <input
              type="text"
              className="form-control"
              value={otp}
              onChange={handleOtpChange}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

OtpVerificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOtpSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default OtpVerificationModal;
