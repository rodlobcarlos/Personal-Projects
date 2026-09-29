# Task model for the application

# Class tasks for representing a task
class Task:
    def __init__(self, name, date, start_time, end_time):
        self.name = name
        self.date = date
        self.start_time = start_time
        self.end_time = end_time

    def tasks(self):
        return {
            "Name: ": self.name,
            "Date: ": self.date,
            "Start_time: ": self.start_time,
            "End_time: ": self.end_time
        }