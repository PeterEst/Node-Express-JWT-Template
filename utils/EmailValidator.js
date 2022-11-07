const EmailValidator = (email) => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email === "") {
    return "Email is required";
  } else if (!email.match(emailRegex)) {
    return "Email is invalid";
  }
  return "";
};

export default EmailValidator;
