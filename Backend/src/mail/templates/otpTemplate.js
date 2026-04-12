export const otpTemplate = (otp) => {
  return `
<h2>Your OTP Code</h2>
<h1>${otp}</h1>
<p>Valid for 5 minutes</p>
`;
};
