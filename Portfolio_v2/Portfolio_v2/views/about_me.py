import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.styles.colors import TextColor, Color

def about_me():
    return rx.hstack(
        rx.vstack(
            rx.text(
                "Sobre mí", 
                size="9",
                margin_top="5%",
            ),
            rx.card(
                rx.heading("Certificaciones", size="5"),
                rx.hstack(
                    rx.image(
                        src="github-foundations.svg",
                        width="20%",
                        height="20%",
                        border_radius="15%",
                        margin_right="20%",
                    ),
                    rx.image(
                        src="nexoneural.jpg",
                        width="20%",
                        height="20%",
                        border_radius="15%",
                        margin_right="20%",
                    ),
                    margin_top="5%",
                    width="100%"
                ),
                margin_top="5%",
            ),
            align="center",
            spacing="8",
            width="100%",
        ),
    )