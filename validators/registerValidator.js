
const validateRegister = (name, email, password) => {
    
    if( [name.trim(), email.trim(), password.trim()].includes('') ) {
        return { msg: 'All fields are required' };
    };

    if( name.length > 45 || email.length > 45 || password.length > 45 ) {
        return { msg: 'Fields can only contain 45 characters' };
    }

    const validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if( !validEmail.test(email) ) {
        return { msg: 'You must enter a valid email' };
    }

    if( password.length < 6 ) {
        return { msg: 'The password must have 6 or more characters' };
    }
}

export default validateRegister;