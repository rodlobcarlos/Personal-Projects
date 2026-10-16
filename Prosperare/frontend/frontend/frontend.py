import reflex as rx
from rxconfig import config
from state import TaskState


# Layout for tasks cards
def task_card(task: dict):
    return rx.card(
        rx.vstack(
            rx.heading(task["title"], size="5"),
            rx.text(task["description"]),
            rx.hstack(
                rx.badge(task["status"]),
                rx.badge(task["priority"]),
                spacing="2",
            ),
            rx.text(task["due_date"]),
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


# Principal container
def index() -> rx.Component:
    # Welcome Page (Index)
    return rx.container(
        rx.vstack(
            rx.heading("Welcome to Prosperare!", size="9"),
            rx.text("Organized your task and projects."),
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
                        required=True,
                    ),
                    rx.select(
                        ["low", "medium", "high"],
                        name="priority",
                        default_value="medium",
                        placeholder="Selecciona la prioridad",
                    ),
                    rx.select(
                        ["pending", "in_progress", "completed"],
                        name="state",
                        default_value="pending",
                        placeholder="Selecciona el estado",
                    ),
                    rx.input(
                        placeholder="Due date(AAAA-DD-MM)",
                        name="due_date",
                        required=True,
                    ),
                    rx.button(
                        "Create task", type="submit",
                    ),
                    align="stretch",
                    width="100%",
                ),
                # Conditionals
                rx.cond(
                    TaskState.error != "",
                    rx.text(TaskState.error, color="red"),
                    rx.fragment(),
                ),
                rx.cond(
                    TaskState.message != "",
                    rx.text(TaskState.error, color="green"),
                    rx.fragment(),
                ),
                rx.divider(),
                rx.heading("My tasks", size="5"),
            ),
            rx.button(
                "Update list.",
                on_click=TaskState.load_tasks,
            ),
            rx.cond(
                TaskState.tasks.length() > 0,
                rx.vstack(
                    rx.foreach(TaskState.tasks, task_card),
                    width="100%",
                    spacing="3",
                ),
                rx.text("There are no task yet."),
            ),
            align="stretch",
            width="100%",
            spacing="4",
        ),
        size="3",
        padding_y="2em",
    )

app = rx.App()
app.add_page(index)
