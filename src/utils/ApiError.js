export default class ApiError extends Error {
    constructor(statusCode, message){
        super(message); // Calls the parent(Error)'s constructor to initialize the standard error object

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}