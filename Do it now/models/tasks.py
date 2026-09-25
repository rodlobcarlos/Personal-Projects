# Task model for the application

# Menu to choose between five options
def menu():
    print("===============================================================")
    print("Welcome to 'Do it now'!\nlook for our differents options on this menu and start improving your days.")
    print("Create. Create your new tasks.")
    print("Edit. Edit your task.")
    print("View. View the task list.")
    print("Delete. Delete your task.")
    print("===============================================================")

# Create new tasks
def createTask():
    name = input("Task name = ")
    date = input("Task date = ")
    start_time = input("Task start time = ")
    end_time = input("Task end time = ")

    return [name, date, start_time, end_time]

def view(taskList):
    for number, task in enumerate(taskList, start=1):
        print(
            f"{number}. {task[0]} | Date: {task[1]} | "
            f"Start: {task[2]} | End: {task[3]}"
        )
    return 


taskList = []
yes = "yes"
no = "no"

# Menu inputs control
while True:
    menu()
    entry = input("What option do you want to use? -> ")
    if entry == "Create":
        taskList.append(createTask())
    elif entry == "View":
        view(taskList)
    elif entry == "Exit":
        print("You exit the app.")
        break

