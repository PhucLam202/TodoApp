use crate::dto::error::{Error, ErrorCode};
use crate::model::todo_model::{TodoApp, CreateTodo, UpdateTodo, AppState};
use actix_web::{web, HttpResponse, Responder, ResponseError};
use uuid::Uuid;
use chrono::Utc;

pub async fn get_todos(data: web::Data<AppState>) -> impl Responder {
    let todos = data.todo_list.lock().unwrap();
    HttpResponse::Ok().json(&*todos)
}

pub async fn create_todo(
    data: web::Data<AppState>,
    create_todo: web::Json<CreateTodo>,
) -> impl Responder {
    if create_todo.title.is_empty() {
        return Error::new("Title cannot be empty", ErrorCode::InvalidInput).error_response();
    }

    let mut todos = data.todo_list.lock().unwrap();
    let new_todo = TodoApp {
        id: Uuid::new_v4(),
        title: create_todo.title.clone(),
        completed: create_todo.completed,
        created_at: Utc::now(),
        status: create_todo.status.clone(),
        priority: create_todo.priority.clone(),
        label: create_todo.label.clone(),
    };
    todos.push(new_todo);
    HttpResponse::Created().json(&*todos)
}

pub async fn update_todo(
    path: web::Path<Uuid>,
    update_data: web::Data<AppState>,
    update_todo: web::Json<UpdateTodo>,
) -> impl Responder {
    let mut todos = update_data.todo_list.lock().unwrap();
    if let Some(todo) = todos.iter_mut().find(|todo| todo.id == *path) {
        if let Some(title) = &update_todo.title {
            todo.title = title.clone(); 
        }
        if let Some(completed) = &update_todo.completed {
            todo.completed = completed.clone();
        }
    
        if let Some(status) = &update_todo.status {
            todo.status = Some(status.clone());
        }
        if let Some(priority) = &update_todo.priority {
            todo.priority = Some(priority.clone());
        }
        if let Some(label) = &update_todo.label {
            todo.label = Some(label.clone());
        }
        HttpResponse::Ok().json(&*todos)
    } else {
        Error::new("Todo not found", ErrorCode::NotFound).error_response()
    }
}

pub async fn delete_todo(path: web::Path<Uuid>, data: web::Data<AppState>) -> impl Responder {
    let mut todos = data.todo_list.lock().unwrap();
    if let Some(pos) = todos.iter().position(|todo| todo.id == *path) {
        todos.remove(pos);
        HttpResponse::NoContent().finish()
    } else {
        Error::new("Todo not found", ErrorCode::NotFound).error_response()
    }
}   