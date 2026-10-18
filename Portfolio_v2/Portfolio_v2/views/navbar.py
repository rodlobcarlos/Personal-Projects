import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.styles.colors import TextColor, Color
from Portfolio_v2.components.links import links

def navbar() -> rx.Component:
    return rx.vstack(
        rx.hstack(
            rx.image(
                src="c.png",
                alt="CRL.dev logo",
                width=styles.Size.BIG.value,
                height=styles.Size.BIG.value,
            ),
            rx.text(
                "CRL.dev Portfolio", 
                size="5",
                margin_top="0.6%"
            ),
            rx.spacer(),
            links(),
            width="100%",
            flex_wrap="wrap",
            gap="1em",
        ),
        position="fixed",
        bg=Color.PRIMARY.value,
        border_bottom=f"0.2em solid {Color.SECUNDARY.value}",
        padding_x=styles.Size.MEDIUM.value,
        padding_y=styles.Size.MEDIUM.value,
        z_index="999",
        top="0",
        width="100%",
    )