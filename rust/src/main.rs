use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{sync::Mutex};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct TodoApp {
    id: Uuid,
    title: String,
    completed: bool,
    created_at: DateTime<Utc>,
}
#[derive(Deserialize)]
struct CreateTodo {
    title: String,
    completed: bool,
}

#[derive(Deserialize)]
struct UpdateTodo {
    title: Option<String>,
    completed: Option<bool>,
}

struct AppState {
    todo_list: Mutex<Vec<TodoApp>>,
}

async fn get_todos(data: web::Data<AppState>) -> impl Responder {
    let todos = data.todo_list.lock().unwrap();
    HttpResponse::Ok().json(&*todos)
}

async fn create_todo(
    data: web::Data<AppState>,
    create_todo: web::Json<CreateTodo>,
) -> impl Responder {
    let mut todos = data.todo_list.lock().unwrap();
    let new_todo = TodoApp {
        id: Uuid::new_v4(),
        title: create_todo.title.clone(),
        completed: create_todo.completed,
        created_at: Utc::now(),
    };
    todos.push(new_todo);
    HttpResponse::Created().json(&*todos)
}

async fn update_todo(
    path: web::Path<Uuid>,
    update_data: web::Data<AppState>,
    update_todo: web::Json<UpdateTodo>,
) -> impl Responder {
    let mut todos = update_data.todo_list.lock().unwrap();
    if let Some(todo) = todos.iter_mut().find(|todo| todo.id == *path){
        if let Some(title) = &update_todo.title{
            todo.title = title.clone();
        }
        if let Some(completed) = &update_todo.completed{
            todo.completed = completed.clone();
        }
        HttpResponse::Ok().json(&*todos)
    }else {
        HttpResponse::NotFound().body("Todo not found")
    }
}

async fn delete_todo(path: web::Path<Uuid>,data:web::Data<AppState>)->impl Responder{
    let mut todos = data.todo_list.lock().unwrap();
    if let Some(pos) = todos.iter().position(|todo| todo.id == *path){
        todos.remove(pos);
        HttpResponse::NoContent().finish()
    }else {
        HttpResponse::NotFound().body("Todo not found")
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()>{
    let app_state = web::Data::new(AppState{
        todo_list: Mutex::new(vec![]),
    });

    HttpServer::new(move || {   
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(1000);
        
            App::new()
            .app_data(app_state.clone())
            .wrap(cors)
            .route("/GetAllTodos", web::get().to(get_todos))
            .route("/CreateTodo", web::post().to(create_todo))
            .route("/UpdateTodo/{id}", web::put().to(update_todo))
            .route("/DeleteTodo/{id}", web::delete().to(delete_todo))
    })      
    .bind("127.0.0.1:8080")?
    .run()
    .await
}