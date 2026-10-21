import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.styles.colors import TextColor, Color

def about_me():
    # Basic card style
    card_style = {
        "width": "320px",
        "height": "430px",
        "border_radius": "16px",
        "_hover": {
            "transform": "translateY(-10px) scale(1.02)",
        },
    }

    # Basic image style
    image_style = {
        "width": "100%",
        "height": "220px",
        "object_fit": "contain",
        "background_color": "rgba(0, 0, 0, 0.15)",
    }

    return rx.vstack(
        rx.heading(
            "Certificaciones", 
            size="9",
            align="center",
            width="100%",
            margin_top="5%",
            color_scheme="green",
        ),

        rx.text(
            "Certificaciones, herramientas y más que te pueden interesar sobre mí", 
            size="6",
            font_style="italic",
            align="center",
            width="100%",
        ),

        rx.hstack(
            rx.card(
                rx.vstack(
                    rx.image(
                        src="github-foundations.svg",
                        **image_style,
                        bg_color="#212332",
                    ),
                    rx.text(
                        "- dasfasdfs \n- dasfasdfs",
                        color="#000000",
                        white_space="pre-line",
                    ),
                ),
                **card_style,
                bg_color="#ffffff",
            ),
            rx.card(
                rx.vstack(
                    rx.image(
                        src="nexoneural.jpg",
                        **image_style,
                        bg_color="#15182E",
                    ),
                    rx.text(
                        "",
                        color="#000000",
                        white_space="pre-line",
                    ),
                    spacing="4",
                    height="100%",
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
    )