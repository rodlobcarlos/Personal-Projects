import reflex as rx
import dataclasses


@dataclasses.dataclass
class User:
    name: str
    email: str
    gender: str


class State(rx.State):
    users: dict[str, User] = {
        "danilo@example.com": User(name="Danilo Sousa", email="danilo@example.com", gender="Male"),
        "zahra@example.com": User(name="Zahra Ambessa", email="zahra@example.com", gender="Female"),
    }

    def add_user(self, form_data: dict):
        new_user = User(**form_data)
        if new_user.email in self.users:
            print("Error: this user already exist.")
        else:
            self.users[new_user.email] = new_user

    def process_form(self, form_data: dict):
        self.add_user(form_data)


def show_user(user: User):
    return rx.table.row(
        rx.table.cell(user.name),
        rx.table.cell(user.email),
        rx.table.cell(user.gender),
    )


def form():
    return rx.form(
        rx.vstack(
            rx.input(placeholder="User Name", name="name", required=True),
            rx.input(placeholder="user@reflex.dev", name="email"),
            rx.select(
                ["Male", "Female"],
                placeholder="Select gender",
                default_value="Male",
                name="gender",
            ),
            rx.button("Submit", type="submit"),
            spacing="3",
            width="100%",
        ),
        on_submit=State.process_form,
        reset_on_submit=True,
        width="100%",
        max_width="24em",
        margin_top="20%",
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
                rx.foreach(State.users.values(), show_user),
            ),
            variant="surface",
            size="3",
        ),
    )