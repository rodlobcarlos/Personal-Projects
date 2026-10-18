import reflex as rx
import Portfolio_v2.styles.styles as styles

def links() -> rx.Component:
    return rx.flex(
        rx.link(
        rx.button("Inicio", size="4"), href="https://inicio/", color_scheme="indigo"),
        rx.link(rx.button("Sobre mi", size="4"), href="https://sobre_mi/", color_scheme="indigo"),
        rx.link(rx.button("Carrera", size="4"), href="https://mi_carrera/", color_scheme="indigo"),
        rx.link(rx.button("Proyectos", size="4"), href="https://proyectos/", color_scheme="indigo"),
        spacing="5",
        direction="row",
        align="end",
    )