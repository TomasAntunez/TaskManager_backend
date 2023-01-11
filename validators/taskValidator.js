
const validateContent = content => {

    if( !content || content.trim() === '' ) {
        const error = new Error('Cannot save an empty task');
        return { msg: error.message };
    }

    if( content.length >= 256 ) {
        const error = new Error('The task must be less than 256 characters');
        return { msg: error.message };
    }
};

export default validateContent;