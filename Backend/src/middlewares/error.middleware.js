import { ApiError } from "../utils/ApiError.js";

/**
 * Centralized error handler.
 * Normalizes any thrown error into a consistent JSON shape and — crucially —
 * never leaks stack traces / internal paths to clients in production.
 * Must be registered AFTER all routes.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        let statusCode = error.statusCode || 500;
        if (error.name === "ValidationError") statusCode = 400;
        if (error.name === "CastError") statusCode = 400; // bad ObjectId, etc.
        if (error.code === 11000) statusCode = 409; // duplicate key
        if (typeof error.message === "string" && error.message.startsWith("Not allowed by CORS")) {
            statusCode = 403;
        }
        error = new ApiError(statusCode, error.message || "Something went wrong", error?.errors || []);
    }

    const isProd = process.env.NODE_ENV === "production";

    const payload = {
        success: false,
        message: error.message,
        errors: error.errors || [],
        ...(isProd ? {} : { stack: error.stack }),
    };

    return res.status(error.statusCode || 500).json(payload);
};

/** JSON 404 for unmatched routes (instead of Express' default HTML page). */
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};

export { errorHandler, notFound };
