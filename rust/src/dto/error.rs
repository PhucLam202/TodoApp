use actix_web::{HttpResponse, ResponseError};
use std::fmt;
use serde::Serialize;
use serde_json;
#[derive(Debug, Serialize)]
pub struct Error {
    pub message: String,
    pub number_error: u16,
    pub code: ErrorCode,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Error {}: {}", self.number_error, self.message)
    }
}

impl Error {
    pub fn new(message: &str, code: ErrorCode) -> Self {
        Error {
            message: message.to_string(),
            number_error: code.clone() as u16,
            code,
        }
    }
}

impl ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code()).json(serde_json::json!({
            "data": {
                "message": self.message
            },
            "msg": self.message,
            "code": self.number_error
        }))
    }

    fn status_code(&self) -> actix_web::http::StatusCode {
        match self.code {
            ErrorCode::InvalidInput => actix_web::http::StatusCode::BAD_REQUEST,
            ErrorCode::NotFound => actix_web::http::StatusCode::NOT_FOUND,
            ErrorCode::InternalServerError => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
            ErrorCode::LabelNotFound => actix_web::http::StatusCode::NOT_FOUND,
            ErrorCode::StatusNotFound => actix_web::http::StatusCode::NOT_FOUND,
            ErrorCode::PriorityNotFound => actix_web::http::StatusCode::NOT_FOUND,
            _ => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub enum ErrorCode {
    InvalidInput = 400,
    NotFound = 404,
    InternalServerError = 500,

    LabelNotFound = 40401,
    StatusNotFound = 40402,
    PriorityNotFound = 40403,
}
