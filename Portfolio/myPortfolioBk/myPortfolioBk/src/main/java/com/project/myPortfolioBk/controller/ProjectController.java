package com.project.myPortfolioBk.controller;

import com.project.myPortfolioBk.model.Project;
import com.project.myPortfolioBk.service.ProjectService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public Project create(@RequestBody Project project) throws Exception {
        List<Project> projectList = projectService.getAllProjects();
        return projectService.create(project, projectList);
    }

    @GetMapping
    public List<Project> projectSet() {
        return projectService.getAllProjects();
    }
}
