

const ErrorHandlers = (req, res, message, status) => {
    res.status(status).json({message:message});
}

export default ErrorHandlers;