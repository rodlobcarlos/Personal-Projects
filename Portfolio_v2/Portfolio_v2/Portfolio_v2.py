import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.views.navbar import navbar
from Portfolio_v2.views.header import header
from Portfolio_v2.views.about_me import about_me
#from Portfolio_v2.views.stack import stack


def index() -> rx.Component:
    # Welcome Page (Index)
    return rx.box(
        navbar(),
        header(),
        rx.divider(margin_top="6%", size="1"),
        about_me(),
        rx.divider(margin_top="6%", size="1"),
        width="100%",
        overflow_x="hidden",  # Cut any element that is hidden in the screen
        background_image= "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
        background_size= "24px 24px",
        min_height= "100vh",
        animation="moveBackground 6s linear infinite",
    ),

app = rx.App(
    stylesheets=styles.STYLESHEETS,
    style= {
        **styles.BASE_STYLE, 
        **styles.CUSTOM_STYLE,
    }
)

app.add_page(
    index,
    title="CRL.dev"
)
