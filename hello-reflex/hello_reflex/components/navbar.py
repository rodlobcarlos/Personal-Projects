import reflex as rx

def navbar() -> rx.Component:
    return rx.flex(
        rx.text("My first navbar on reflex.", size="3"),
        border_top="1px solid var(--gray-4)",
        padding="4",
        justify="center",
        background_color="var(--gray-3)",
        width="100%",
        height="5%",

        position="fixed",
        top="0",
        left="50",
        z_index="100",
    )