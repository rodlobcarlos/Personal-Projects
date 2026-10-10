import reflex as rx
import dataclasses


@dataclasses.dataclass
class User:
    name: str
    email: str
    gender: str


class State(rx.State):
    users: list[User] = [
        User(name="Danilo Sousa", email="danilo@example.com", gender="Male"),
        User(name="Zahra Ambessa", email="zahra@example.com", gender="Female"),
    ]

    def add_user(self, form_data: dict):
        self.users.append(User(**form_data))

    def delete_user(self, form_data: dict):
        # Evitamos un error si el usuario no existe en la lista
        target = User(**form_data)
        if target in self.users:
            self.users.remove(target)

    # Creamos esta función para decidir si añadir o borrar según el botón pulsado
    def process_form(self, form_data: dict):
        action = form_data.pop("action", "submit")
        if action == "Delete":
            self.delete_user(form_data)
        else:
            self.add_user(form_data)


def show_user(user: User):
    """Show a person in a table row."""
    return rx.table.row(
        rx.table.cell(user.name),
        rx.table.cell(user.email),
        rx.table.cell(user.gender),
    )


def form():
    return rx.form(
        rx.vstack(
            rx.input(placeholder="User Name", name="name", required=True),
            rx.input(
                placeholder="user@reflex.dev",
                name="email",
            ),
            rx.select(
                ["Male", "Female"],
                placeholder="Select gender",
                default_value="Male",
                name="gender",
                custom_attrs={"aria-label": "Gender"},
            ),
            # Los dos botones ordenados verticalmente uno bajo el otro
            rx.vstack(
                rx.button(
                    "Submit", 
                    type="submit", 
                    name="action", 
                    value="submit", 
                    width="100%"
                ),
                rx.button(
                    "Delete", 
                    type="submit", 
                    name="action", 
                    value="delete", 
                    color_scheme="red", 
                    width="100%"
                ),
                width="100%",
                spacing="3",
            ),
            align="stretch",
            spacing="3",
            width="100%",
        ),
        # El evento on_submit procesa los datos llamando a nuestra nueva función
        on_submit=State.process_form,
        reset_on_submit=True,
        width="100%",
        max_width="24em",
        margin_top="10%",
    )


def dashboard() -> rx.Component:
    return rx.vstack(
        form(),
        rx.table.root(
            rx.table.header(
                rx.table.row(
                    rx.table.column_header_cell("Name"),
                    rx.table.column_header_cell("Email"),
                    rx.table.column_header_cell("Gender"),
                ),
            ),
            rx.table.body(
                rx.foreach(State.users, show_user),
            ),
            variant="surface",
            size="3",
        ),
    )
