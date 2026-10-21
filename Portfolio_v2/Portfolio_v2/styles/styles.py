import reflex as rx
from .fonts import Font
from .colors import TextColor, Color
from enum import Enum


class Size(Enum):
    SMALL = "0.5em"
    MEDIUM = "1.5em"
    BIG = "3em"

# Default styles
STYLESHEETS = [
    # It doesn't penalize app loading via swap.
    "https://fonts.googleapis.com/css2?family=Nabla&display=swap",
    "https://fonts.googleapis.com/css2?family=Ubuntu&display=swap",
]

# Default values
BASE_STYLE = { 
    "font_family": Font.DEFAULT.value,
    "color": TextColor.PRIMARY.value,
    "background": Color.PRIMARY.value
}

CUSTOM_STYLE = {
    "@keyframes moveBackground": {
        "0%": {
            "background_position": "0px 0px",
        },
        "100%": {
            "background_position": "24px 24px",
        },
    },
}