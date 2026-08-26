package com.project.myPortfolioBk.controller;

import com.project.myPortfolioBk.model.Project;
import com.project.myPortfolioBk.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public Project create(@RequestBody Project project) throws Exception {
        return projectService.create(project);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Project project) throws Exception {
        return projectService.update(id, project);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) throws Exception {
        projectService.delete(id);
    }
}
