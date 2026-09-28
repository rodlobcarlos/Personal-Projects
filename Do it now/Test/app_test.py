# Python
import pytest

from models import createTask, deleteTask, editTask, menu, view


def test_menu_prints_options(capsys):
    menu()

    output = capsys.readouterr().out

    assert "Create" in output
    assert "Edit" in output
    assert "View" in output
    assert "Delete" in output


def test_createTask_returns_task_dictionary(monkeypatch):
    answers = iter(["Estudiar", "2026-01-10", "09:00", "10:00"])
    monkeypatch.setattr("builtins.input", lambda _prompt: next(answers))

    task = createTask()

    assert task == {
        "Name": "Estudiar",
        "Date": "2026-01-10",
        "Start_time": "09:00",
        "End_time": "10:00",
    }


def test_view_prints_tasks(capsys):
    task_list = [{"Name": "Leer", "Date": "2026-01-10"}]

    view(task_list)

    output = capsys.readouterr().out
    assert "0." in output
    assert "Leer" in output
    assert "2026-01-10" in output


def test_view_empty_list_prints_message(capsys):
    view([])

    assert "doesn't exist any list" in capsys.readouterr().out


def test_deleteTask_removes_selected_task(monkeypatch):
    task_list = [{"Name": "Leer"}, {"Name": "Estudiar"}]
    monkeypatch.setattr("builtins.input", lambda _prompt: "0")

    deleteTask(task_list)

    assert task_list == [{"Name": "Estudiar"}]


def test_deleteTask_invalid_index_preserves_tasks(monkeypatch):
    task_list = [{"Name": "Leer"}]
    monkeypatch.setattr("builtins.input", lambda _prompt: "5")

    deleteTask(task_list)

    assert task_list == [{"Name": "Leer"}]


def test_deleteTask_empty_list_returns_without_input(monkeypatch):
    def unexpected_input(_prompt):
        pytest.fail("No debería solicitar entrada si la lista está vacía.")

    monkeypatch.setattr("builtins.input", unexpected_input)

    deleteTask([])


def test_editTask_updates_selected_task(monkeypatch, capsys):
    task_list = [
        {"Name": "Leer", "Date": "2026-01-10"},
        {"Name": "Estudiar", "Date": "2026-01-11"},
    ]
    answers = iter(["1", "Repasar Python", "Name"])
    monkeypatch.setattr("builtins.input", lambda _prompt: next(answers))

    editTask(task_list)

    assert task_list[0]["Name"] == "Leer"
    assert task_list[1]["Name"] == "Repasar Python"
    assert "successful" in capsys.readouterr().out


def test_editTask_invalid_key_preserves_task(monkeypatch):
    task_list = [{"Name": "Leer", "Date": "2026-01-10"}]
    answers = iter(["0", "Nuevo valor", "Unknown"])
    monkeypatch.setattr("builtins.input", lambda _prompt: next(answers))

    editTask(task_list)

    assert task_list == [{"Name": "Leer", "Date": "2026-01-10"}]


def test_editTask_invalid_index_preserves_tasks(monkeypatch):
    task_list = [{"Name": "Leer", "Date": "2026-01-10"}]
    monkeypatch.setattr("builtins.input", lambda _prompt: "5")

    editTask(task_list)

    assert task_list == [{"Name": "Leer", "Date": "2026-01-10"}]


def test_editTask_empty_list_returns_without_input(monkeypatch):
    def unexpected_input(_prompt):
        pytest.fail("No debería solicitar entrada si la lista está vacía.")

    monkeypatch.setattr("builtins.input", unexpected_input)

    editTask([])