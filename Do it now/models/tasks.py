# Task model for the application

# Menu to choose between four options
def menu():
    print("===============================================================")
    print("Welcome to 'Do it now'!\nlook for our differents options on this menu and start improving your days.")
    print("Create. Create your new tasks.")
    print("Edit. Edit your task.")
    print("Delete. Delete your task.")
    print("===============================================================")
menu()

# Create new tasks
def createTask():
    name = input("Task name = ")
    date = input("Task date = ")
    start_time = input("Task start time = ")
    end_time = input("Task end time = ")

    taskList = []
    taskList.append(name)
    taskList.append(date)
    taskList.append(start_time)
    taskList.append(end_time)

    print(taskList)
    return taskList

ask = input("What option do you want to use? -> ")

# Menu inputs control
match ask:
    case "Create":
        createTask()
    case _:
        print("You exit the app.")