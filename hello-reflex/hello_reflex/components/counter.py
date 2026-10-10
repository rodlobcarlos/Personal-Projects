import reflex as rx

class State(rx.State):
    count: int = 0

    @rx.event
    def increment(self):
        self.count +=1

    @rx.event
    def decrement(self):
        self.count -=1

def counter():
    return rx.hstack(
        rx.button(
            "Decrement",
            color_scheme="ruby",
            on_click=State.decrement,
        ),
        rx.heading(State.count, font_size="2em"),
        rx.button(
            "Increment",
            color_scheme="grass",
            on_click=State.increment,
        ),

        margin_top="4%",
        spacing="4",
        justify="center",
    ), 