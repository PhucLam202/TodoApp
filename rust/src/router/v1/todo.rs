use actix_web::web;

use crate::service::todo::{get_todos, create_todo, update_todo, delete_todo};

pub fn todo_router(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .route("/GetAllTodos", web::get().to(get_todos))
            .route("/CreateTodo", web::post().to(create_todo))
            .route("/UpdateTodo/{id}", web::put().to(update_todo))
            .route("/DeleteTodo/{id}", web::delete().to(delete_todo))
    );
}