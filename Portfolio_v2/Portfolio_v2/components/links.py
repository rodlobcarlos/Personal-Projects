import reflex as rx
import Portfolio_v2.styles.styles as styles

def links() -> rx.Component:
    return rx.flex(
        rx.link(
            rx.button(
                "Inicio", 
                size="3",
                color_scheme="indigo",
                cursor="pointer",
                border_radius="0px",
                box_shadow="4px 4px 0px 0px #ffffff",
                _hover={
                    "transform": "translate(5px, 5px)",
                    "box_shadow": "0px 0px 0px 0px #ffffff",
                },
            ), 
            href="/",
            color_scheme="indigo",
        ),
        rx.link(
            rx.button(
                "Sobre mi", 
                size="3",
                color_scheme="grass",
                cursor="pointer",
                border_radius="0px",
                box_shadow="4px 4px 0px 0px #ffffff",
                _hover={
                    "transform": "translate(5px, 5px)",
                    "box_shadow": "0px 0px 0px 0px #ffffff",
                },
            ),
            href="#about_me", 
            color_scheme="indigo",
        ),
        rx.link(
            rx.button(
                "Carrera", 
                size="3",
                color_scheme="bronze",
                cursor="pointer",
                border_radius="0px",
                box_shadow="4px 4px 0px 0px #ffffff",
                _hover={
                    "transform": "translate(5px, 5px)",
                    "box_shadow": "0px 0px 0px 0px #ffffff",
                },
            ),
            href="#about_me", 
            color_scheme="indigo",
        ),
        rx.link(
            rx.button(
                "Proyectos", 
                size="3",
                color_scheme="gray",
                cursor="pointer",
                border_radius="0px",
                box_shadow="4px 4px 0px 0px #ffffff",
                _hover={
                    "transform": "translate(5px, 5px)",
                    "box_shadow": "0px 0px 0px 0px #ffffff",
                },
            ),
            href="#about_me", 
            color_scheme="indigo",
        ),
        rx.link(
            rx.button(
                "CV",
                rx.icon("file-text", size=18),
                size="3",
                color_scheme="orange",
                cursor="pointer",
                border_radius="0px",
                box_shadow="4px 4px 0px 0px #ffffff",
                _hover={
                    "transform": "translate(5px, 5px)",
                    "box_shadow": "0px 0px 0px 0px #ffffff",
                },
                on_click=rx.download(url="/CV_Carlos Rodríguez Lobato.pdf", filename="CV_Carlos Rodríguez Lobato.pdf"),
            ), 
        ),
        spacing="5",
        direction="row",
        align="end",
        is_external=True,
    )