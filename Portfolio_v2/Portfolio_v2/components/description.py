import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.styles.colors import TextColor, Color

def description():
    # Basic card style
    card_style = {
        "width": "900px",
        "height": "300px",
        "box_shadow": "-2.8px -6px 0px 3px #ffffff",
        "padding": "0",
        "border": "2px solid #000000",
        "border_radius": "0px",
        "_hover": {
            "transform": "translateY(-10px) scale(1.02)",
            "box_shadow": "-2px -2px 0px 0px #ffffff",
        },
    }

    return rx.vstack(
        rx.heading(
            "Descripción", 
            align="center",
            width="100%",
            margin_top="5%",
            color_scheme="green",
        ),
        rx.hstack(
            # Github foundations card
            rx.card(
                rx.vstack(
                    rx.text(
                        rx.heading("\t Me presento:\n", size="5"),
                        rx.text(
                            "\t Me llamo Carlos Rodríguez Lobato, desarrollador full-stack|DevOps. Resido en Sevilla/España y estoy abierto a trabajar en remoto o al desplazamiento dentro del país." \
                            " Mis preferencias laborales son el desarrollo backend/frontend y trabajar como DevOps. Cuento con conocimientos en los dos campos, además de tener experiencia de 4 meeses con prácticas en empresas, " \
                            " donde aprendí sobre Java(Spring boot) e hice mi primer despliegue en la nube (Azure) sobre un mini proyecto(consultor de vuelos en tiempo real)." \
                            " Me encantan los retos, me gusta trabajar en equipo y estar rodeas de buenos profesionales." \
                            "\n - Prefiero trabajar con Python, ya que conozco el lenguaje bien y tengo experiencia con el tras trabajarlo en proyectos personales." \
                            " Además también puedo trabajar con angular, js y java.",
                            tab_size="8",
                        ),
                        color="#000000",
                        white_space="pre-wrap",
                        tab_size="2",
                    ),
                ),
                **card_style,
                bg_color="#ffffff",
            ),
            # Properties to center cards
            justify="center",
            align="stretch",
            spacing="6",
            width="100%",
            wrap="wrap",
            margin_top="2%",
        ),
        rx.hstack(
            rx.link(
                rx.button(
                    "LinkdIn", 
                    size="3",
                    color_scheme="blue",
                    cursor="pointer",
                    border_radius="0px",
                    box_shadow="4px 4px 0px 0px #ffffff",
                    _hover={
                        "transform": "translate(5px, 5px)",
                        "box_shadow": "0px 0px 0px 0px #ffffff",
                    },
                ), 
                href="https://www.linkedin.com/in/carlos-rodr%C3%ADguez-lobato-211b27330/",
                is_external=True,
                color_scheme="indigo",
                style={"transform": "rotate(30deg)"},
            ),
            rx.spacer(),
            rx.link(
                rx.button(
                    "GitHub", 
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
                href="https://github.com/rodlobcarlos?tab=overview&from=2026-05-01&to=2026-05-31",
                is_external=True,
                color_scheme="indigo",
                style={"transform": "rotate(-30deg)"},
            ),
            rx.spacer(),
            rx.link(
                rx.button(
                    "Gmail", 
                    size="3",
                    color_scheme="red",
                    cursor="pointer",
                    border_radius="0px",
                    box_shadow="4px 4px 0px 0px #ffffff",
                    _hover={
                        "transform": "translate(5px, 5px)",
                        "box_shadow": "0px 0px 0px 0px #ffffff",
                    },
                ), 
                href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJftLcKqXBjHKjGmBcrrsGTzTCRgwMwGjZRGvmFtKkMLljWKnlQtkJTDgMVCSQHGzggCwSV",
                is_external=True,
                color_scheme="indigo",
                style={"transform": "rotate(30deg)"},
            ),
            rx.spacer(),
            rx.link(
                rx.button(
                    "InfoJobs", 
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
                href="https://www.infojobs.net/candidate/cv/view/index.xhtml",
                is_external=True,
                color_scheme="indigo",
                style={"transform": "rotate(-30deg)"},
                
            ),
            margin_top="4%",
            justify="center",
        ),
        wrap="wrap",
        margin_right="8%",
        margin_top="4%",
    )