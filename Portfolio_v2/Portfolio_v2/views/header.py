import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.styles.colors import TextColor, Color

def header() ->rx.Component:
    return rx.hstack(
        rx.vstack(
            rx.text(
                "Carlos Rodríguez Lobato",
                size="9",
                font_weight="bold"
            ),
            rx.text(
                "Desarrollador full-stack || DevOps",
                size="6",
                font_style="italic",
            ),
            rx.text(
                "¡Hola! Bienvenido a mi portfolio personal. Aquí puedes encontrar información sobre mis habilidades, proyectos y experiencias. \nEspero que disfrutes explorándolo y " \
                "aprendiendo más sobre mí. Si tienes alguna pregunta o quieres ponerte en contacto, \nno dudes en escribirme a través del correo electrónico indicado.",
                size="4",
                white_space="pre-line",
            ),
        ),

        rx.spacer(),

        rx.image(
            src="profile.jpg",
            alt="CRL.dev logo",
            width="20%",
            height="20%",
            border_radius="15%",
            margin_right="20%",
        ),

        align="center",
        justify="between",
        margin_top="6%",
        padding_x="10%",
        width="100%",
        wrap="wrap",
    )