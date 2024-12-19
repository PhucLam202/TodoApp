use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use crate::router::v1::configure;
use crate::model::todo_model::AppState;
use std::sync::Mutex;

mod router;
mod service;
mod model;
mod dto;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
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
            .configure(configure)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}