
const validateEmail = email => {
    if( email.trim() === '' ) {
        return { msg: 'The email cannot be empty' };
    };

    if( email.length > 45 ) {
        return { msg: 'The email can only contain 45 characters' };
    }

    const validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if( !validEmail.test(email) ) {
        return { msg: 'You must enter a valid email' };
    }
};

export default validateEmail;