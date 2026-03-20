package com.project.myPortfolioBk.controller;

import com.project.myPortfolioBk.model.Project;
import com.project.myPortfolioBk.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("api/projects")
@CrossOrigin(origins = "*") // for front connected
public class ProjectController {

    private ProjectService projectService;

    @GetMapping
    public Set<Project> projectSet() {
        return projectService.getAllProjects();
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectService.create(project);
    }
}
