
import reflex as rx
from rxconfig import config
from state import TaskState


# Layout for task cards
def task_card(task: dict) -> rx.Component:
    return rx.card(
        rx.vstack(
            rx.heading(task["title"], size="5"),
            rx.text(task["description"]),
            rx.hstack(
                rx.badge(task["status"]),
                rx.badge(task["priority"]),
                spacing="2",
            ),
            rx.cond(
                task["due_date"],
                rx.text("Due date: ", task["due_date"]),
                rx.text("No due date"),
            ),
            rx.button(
                "Delete",
                color_scheme="red",
                variant="soft",
                on_click=TaskState.remove_task(task["id"]),
            ),
            align="start",
            width="100%",
        ),
        width="100%",
    )


# Main page
def index() -> rx.Component:
    return rx.container(
        rx.vstack(
            rx.heading("Welcome to Prosperare!", size="9"),
            rx.text("Organize your tasks and projects."),
            rx.divider(),

            rx.heading("New task", size="5"),

            rx.form(
                rx.vstack(
                    rx.input(
                        placeholder="Task title",
                        name="title",
                        required=True,
                    ),
                    rx.text_area(
                        placeholder="Task description",
                        name="description",
                    ),
                    rx.select(
                        ["low", "medium", "high"],
                        name="priority",
                        default_value="medium",
                        placeholder="Select priority",
                    ),
                    rx.select(
                        ["pending", "in_progress", "completed"],
                        name="status",
                        default_value="pending",
                        placeholder="Select status",
                    ),
                    rx.input(
                        placeholder="Due date (YYYY-MM-DD)",
                        name="due_date",
                    ),
                    rx.button(
                        "Create task",
                        type="submit",
                    ),
                    align="stretch",
                    width="100%",
                ),
                on_submit=TaskState.add_task,
                reset_on_submit=True,
                width="100%",
            ),

            # Error message
            rx.cond(
                TaskState.error != "",
                rx.text(TaskState.error, color="red"),
                rx.fragment(),
            ),

            # Success message
            rx.cond(
                TaskState.message != "",
                rx.text(TaskState.message, color="green"),
                rx.fragment(),
            ),

            rx.divider(),
            rx.heading("My tasks", size="5"),

            rx.button(
                "Update list",
                on_click=TaskState.load_tasks,
            ),

            rx.cond(
                TaskState.tasks.length() > 0,
                rx.vstack(
                    rx.foreach(TaskState.tasks, task_card),
                    width="100%",
                    spacing="3",
                ),
                rx.text("There are no tasks yet."),
            ),

            align="stretch",
            width="100%",
            spacing="4",
        ),
        size="3",
        padding_y="2em",
    )


app = rx.App()
app.add_page(index, on_load=TaskState.load_tasks)
