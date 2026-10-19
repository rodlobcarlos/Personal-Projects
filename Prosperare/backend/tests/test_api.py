from fastapi.testclient import TestClient

from app.main import app

# Create a TestClient instance for testing the FastAPI app
client = TestClient(app)

# Test for checking mongodb connectivity
def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["Status"] == "ok"
    assert response.json()["Database"] == "connected"

# Test for checking get tasks method
# Test for checking post tasks method
# Test for checking put tasks method
# Test for checking delete tasks method