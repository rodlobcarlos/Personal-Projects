# Task model for the application

class Task:

    contador = 0

    def __init__(self, name, date, initialHour, finishHour, completed = "false"):
        Task.contador +=1
        self.id = Task.contador
        self.name = name
        self.date = date
        self.initialHour = initialHour
        self.finishHour = finishHour
        self.completed = completed

    def createTask():
        tasks = []
        activador = False
        ask = input("Quieres seguir?:  ")
        while activador == False:
            if ask == "No":
                print("El usuario ya no quiere crear más tareas.")
                activador
                break
        while ask == "Si":
            create = input("Crea una tarea: ")
            tasks.append(create)
            activador = True
            return tasks
        if ask == "No":
            return "Tasks list: ", tasks

    saveResult = createTask()
    print(saveResult)