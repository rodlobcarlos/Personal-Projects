import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.styles.colors import TextColor, Color
from Portfolio_v2.components.certifications import certifications
from Portfolio_v2.components.description import description

def about_me():
    # Basic card style
    card_style = {
        "width": "400px",
        "height": "500px",
        "box_shadow": "-2.8px -6px 0px 3px #ffffff",
        "padding": "0",
        "border": "1px solid #000000",
        "border_radius": "0px",
        "_hover": {
            "transform": "translateY(-10px) scale(1.02)",
            "box_shadow": "-2px -2px 0px 0px #ffffff",
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
            "Investiga un poco más sobre mí", 
            size="9",
            align="center",
            width="100%",
            margin_top="5%",
            color_scheme="green",
        ),
        rx.text(
            "Descubre sobre que ",
            rx.el.span("herramientas/lenguajes", style={"color": "#3589ff"}),
            " tengo práctica y fundamentos para trabajar en mi día a día.\n Además, cuento con varias ",
            rx.el.span("certificaciones", style={"color": "#ccff00"}),
            " que le aportan valor a mi perfil.",
            size="6",
            font_style="italic",
            align="center",
            width="100%",
            white_space="pre-line",
        ),
        rx.hstack(
            certifications(),
            rx.spacer(),
            description(),
        ),
        
        justify="center",
        align="stretch",
        spacing="6",
        width="100%",
        wrap="wrap",
        margin_top="2%",
    )