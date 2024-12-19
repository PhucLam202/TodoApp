use actix_web::web;

pub mod todo;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .configure(todo::todo_router)
    );
}