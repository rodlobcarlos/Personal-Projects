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
    name = input("Name = ")
    date = input("Date = ")
    start_time = input("Start time = ")
    end_time = input("End time = ")

    return {
        "Name": name,
        "Date": date,
        "Start_time": start_time,
        "End_time": end_time
    }

# View all the task I created
def view(taskList):
    if not taskList:
        print("It doesn't exist any list.")

    for number, task in enumerate(taskList, start=0):
        print(f"{number}. | {task.items()}")
    return


# Delete by the task id
def deleteTask(taskList):
    if not taskList:
        print("It doesn't exist any list.")
        
        return

    view(taskList)
    number = int(input("Which task do you want to delete?: "))
    
    if 0 <= number < len(taskList): # Check if the index is valid
        taskList.pop(number)
        print("Your delete was successful :)")
    else:
        print("That index doesn't exist.")
    return

# Edit by position
def editTask(taskList):
    if not taskList:
        print("There is no list to edit.")
        return

    view(taskList)
    number = int(input("Which task do you want to edit?: "))

    if not 0 <= number < len(taskList):
        print("That index doesn't exist.")
        return

    edit = input("Introduce your change: ")
    key = input("In which key: ").capitalize()
    if key not in taskList[number]:
        print("Try again writting that key.")
        return

    taskList[number][key] = edit
    print("Your edit was successful :)")


def run_app():
    menu()
    task_list = []

    while True:
        entry = input("What option do you want to use? -> ")
        if entry == "Create":
            task_list.append(createTask())
        elif entry == "View":
            view(task_list)
        elif entry == "Delete":
            deleteTask(task_list)
        elif entry == "Edit":
            editTask(task_list)
        elif entry == "Exit":
            print("You exit the app.")
            break

if __name__ == "__main__":
    run_app()