import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.views.navbar import navbar
from Portfolio_v2.views.header import header

class State(rx.State):
    """The app state."""


def index() -> rx.Component:
    # Welcome Page (Index)
    return rx.box(
        navbar(),
        header(),
        width="100%",
        overflow_x="hidden",  # Corta cualquier posible elemento que sobresalga
    ),


app = rx.App(
    stylesheets=styles.STYLESHEETS,
    style=styles.BASE_STYLE
)

app.add_page(
    index,
    title="CRL.dev")
