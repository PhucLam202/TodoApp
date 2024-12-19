use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use uuid::Uuid;



#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TodoApp {
    pub id: Uuid,
    pub title: String,
    pub completed: bool,
    pub created_at: DateTime<Utc>,
    pub status: Option<Status>,
    pub priority: Option<Priority>,
    pub label: Option<Label>,
}
#[derive(Deserialize)]
pub struct CreateTodo {
    pub title: String,
    pub completed: bool,
    pub status: Option<Status>,
    pub priority: Option<Priority>,
    pub label: Option<Label>,
}

#[derive(Deserialize)]
pub struct UpdateTodo {
    pub title: Option<String>,
    pub completed: Option<bool>,
    pub status: Option<Status>,
    pub priority: Option<Priority>,
    pub label: Option<Label>,
}

pub struct AppState {
    pub todo_list: Mutex<Vec<TodoApp>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Label {
    Work,
    Personal,
    Shopping,
    Others,
}


#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Status {
    Active,
    Inactive,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Priority {
    VeryLow,
    Low,
    Medium,
    High,
    VeryHigh,
}