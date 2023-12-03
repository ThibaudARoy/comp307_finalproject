export const validateEmail = (email) => {
    const atPosition = email.indexOf('@');
    const dotPosition = email.lastIndexOf('.');
    return (atPosition > 0 && dotPosition > atPosition + 1 && dotPosition < email.length - 1);
};

export const validatePassword = (password) => {
    return password.length >= 8;
};

export const isNonEmpty = (value) => {
    return value.trim() !== '';
};

export const isEmailValidForLogin = (email) => {
    return !!email && email.trim() !== '' && email.includes("@");
};

export const isPasswordValidForLogin = (password) => {
    return !!password;
};