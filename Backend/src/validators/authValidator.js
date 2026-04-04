export const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
}

export const validatePassword = (password) => {
    return password && password.length >= 6;
}

export const validateRegister = ({ name, email, password }) => {
    if (!name || !email || !password) {
        return "All fields are required";
    }

    if (!validateEmail(email)) {
        return "Invalid email format";
    }

    if (!validatePassword(password)) {
        return "Password must be at least 6 characters";
    }

    return null // no error
}
export const validateLogin = ({ email, password }) => {
    if (!email || !password) {
        return "All fields are required";
    }

    if (!validateEmail(email)) {
        return "Invalid email format";
    }

    return null // no error
}
