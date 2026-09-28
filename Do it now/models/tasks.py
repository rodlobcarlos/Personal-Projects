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
    if not taskList:
        print("It doesn't exist any list.")

    for number, task in enumerate(taskList, start=0):
        print(
            f"{number}. | Name: {task[0]} | Date: {task[1]} | "
            f"Start: {task[2]} | End: {task[3]}"
        )
    return 

def deleteTask(taskList):
    if not taskList:
        print("It doesn't exist any list.")
        
    view(taskList)
    number = int(input("Which task do you want to delete?: "))
    
    if 0 <= number < len(taskList): # Check if the index is valid
        taskList.pop(number)
        print("Your delete was successful :)")
    else:
        print("That index doesn't exist.")
    return

def editTask(taskList):
    if not taskList:
        print("There is no list to edit.")

    view(taskList)
    number = int(input("Which task do you want to edit?: "))

    if 0 < number <= len(taskList):
        edit = input("Introduce de change: ")
        taskList[number] = edit
        print("Changed")
    return

taskList = []

# Menu inputs control
while True:
    menu()
    entry = input("What option do you want to use? -> ")
    if entry == "Create":
        taskList.append(createTask())
    elif entry == "View":
        view(taskList)
    elif entry == "Delete":
        deleteTask(taskList)
    elif entry == "Edit":
        editTask(taskList)
    elif entry == "Exit":
        print("You exit the app.")
        break