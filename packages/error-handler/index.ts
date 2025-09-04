export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOpernational: boolean;
  public readonly details: any;

  constructor(
    message: string,
    statusCode: number,
    isOpernational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOpernational = isOpernational;
    this.details = details;
    Error.captureStackTrace(this);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Not found error
export class NotFoundError extends AppError {
    constructor(message = "Resource not found", details?: any) {
        super(message, 404, true, details);
    }
}

// Validation error
export class ValidationError extends AppError {
    constructor(message = "Validation error", details?: any) {
        super(message, 400, true, details);
    }
}

// Authentication error
export class AuthenticationError extends AppError {
    constructor(message = "Authentication failed", details?: any) {
        super(message, 401, true, details);
    }
}

// Forbidden error - sending request on admin route but not admin
export class ForbiddenError extends AppError {
    constructor(message = "Access forbidden", details?: any) {
        super(message, 403, true, details);
    }  
}

// DataEror - error related to database
export class DataError extends AppError {
    constructor(message = "Data error", details?: any) {
        super(message, 500, true, details);
    } 
}
// Internal server error
export class InternalServerError extends AppError {
    constructor(message = "Internal server error", details?: any) {
        super(message, 500, false, details);
    }
}

// Rate limit error
export class RateLimitError extends AppError {
    constructor(message = "Too many requests, please try again later.", details?: any) {
        super(message, 429, true, details);
    }
}