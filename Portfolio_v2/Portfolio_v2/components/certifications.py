import reflex as rx
import Portfolio_v2.styles.styles as styles
from Portfolio_v2.styles.colors import TextColor, Color

def certifications():
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
        rx.button(
            "Certificado!!", 
            size="3",
            color_scheme="gold",
            cursor="pointer",
            border_radius="0px",
            box_shadow="4px 4px 0px 0px #ffffff",
            _hover={
                "transform": "translate(5px, 5px)",
                "box_shadow": "0px 0px 0px 0px #ffffff",
            },
        ), 
        rx.hstack(
            # Github foundations card
            rx.card(
                rx.vstack(
                    rx.image(
                        src="github-foundations.svg",
                        **image_style,
                        bg_color="#212332",
                    ),
                    rx.text(
                        rx.heading("\t Habilidades evaluadas:\n", size="5"),
                        rx.divider(),
                        "\t- Comprender los conceptos básicos de Git y GitHub\n"
                        "\t- Trabajar con repositorios de GitHub\n" 
                        "\t- Colabora usando GitHub\n"  
                        "\t- Aplicar prácticas de desarrollo modernas\n"  
                        "\t- Gestiona proyectos con GitHub\n"   
                        "\t- Comprender la privacidad, la seguridad y la administración.\n"    
                        "\t- Explora la comunidad de GitHub\n",
                        color="#000000",
                        white_space="pre-wrap",
                        tab_size="2",
                    ),
                ),
                rx.link(
                    rx.button(
                        "Ver",
                        border_radius="0px",
                        width="50%",  
                        box_shadow="4px 4px 0px 0px #000000",
                        _hover={
                            "transform": "translate(5px, 5px)",
                            "box_shadow": "0px 0px 0px 0px #ffffff",
                        },
                        cursor="pointer",
                    ),
                    href="https://www.linkedin.com/in/carlos-rodr%C3%ADguez-lobato-211b27330/details/certifications/",
                    is_external=True,
                    text_decoration="none",
                    width="50%",
                    align_self="end",
                ),
                **card_style,
                bg_color="#ffffff",
            ),

            # NexoNeural card
            rx.card(
                rx.vstack(
                    rx.image(
                        src="nexoneural.jpg",
                        **image_style,
                        bg_color="#15182E",
                    ),
                    rx.text(
                        rx.heading("\t Habilidades evaluadas:\n", size="5"),
                        "\t- Qué es una IA.\n" \
                        "\t- Automatizaciones.\n" \
                        "\t- Crear asistentes.\n"
                        "\t- Herramientas útiles.\n"
                        "\t- Marco legal y ético.\n"
                        "\t- Como ser profesionales de la IA.\n"
                        "\t- La importancia de los datos.\n"
                        "\t- Como trabajar con la IA y otros sistemas.\n", 
                        color="#000000",
                        white_space="pre-wrap",
                        tab_size="2",
                    ),
                ),
                rx.link(
                    rx.button(
                        "Ver",
                        border_radius="0px",
                        width="50%",  
                        box_shadow="4px 4px 0px 0px #000000",
                        _hover={
                            "transform": "translate(5px, 5px)",
                            "box_shadow": "0px 0px 0px 0px #ffffff",
                        },
                        cursor="pointer",
                    ),
                    href="https://www.linkedin.com/in/carlos-rodr%C3%ADguez-lobato-211b27330/details/certifications/",
                    is_external=True,
                    text_decoration="none",
                    width="50%",
                    align_self="end",
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
        margin_left="8%",
        margin_top="4%",
    )