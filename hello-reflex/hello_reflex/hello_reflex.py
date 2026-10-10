import reflex as rx
from hello_reflex.components.footer import footer
from hello_reflex.components.navbar import navbar
from hello_reflex.components.counter import counter
from hello_reflex.components.dashboard import dashboard


def index():
    return rx.hstack(
        navbar(),
        counter(),
        dashboard(),    
        footer(),
        justify="center",
        ),

app = rx.App()
app.add_page(index)
