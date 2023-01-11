
const validatePassword = password => {
    if( !password || password.trim() === '' ) {
        return { msg: 'The password cannot be empty' };
    };

    if( password.length > 45 ) {
        return { msg: 'The password can only contain 45 characters' };
    }

    if( password.length < 6 ) {
        return { msg: 'The password must have 6 or more characters' };
    }
};

export default validatePassword;