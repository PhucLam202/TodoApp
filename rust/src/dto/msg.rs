use crate::dto::error::ErrorCode;

impl ErrorCode {
    pub fn message(&self) -> &'static str {
        match self {
            ErrorCode::InvalidInput => "Invalid input provided",
            ErrorCode::NotFound => "Resource not found",
            ErrorCode::InternalServerError => "Internal server error",
            ErrorCode::LabelNotFound => "Label not found",
            ErrorCode::StatusNotFound => "Status not found",
            ErrorCode::PriorityNotFound => "Priority not found",
        }
    }
}