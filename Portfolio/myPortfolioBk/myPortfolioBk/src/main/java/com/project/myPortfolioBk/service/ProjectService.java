package com.project.myPortfolioBk.service;

import com.project.myPortfolioBk.exception.PortfolioException;
import com.project.myPortfolioBk.model.Project;
import com.project.myPortfolioBk.repository.ProjectRepository;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Data // auto getters and setters
public class ProjectService {

    // logger
    private static final Logger logger = LogManager.getLogger(ProjectService.class);
    // repository class
    private ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // save new project
    public Project create(Project project, List<Project> projectList) throws Exception {
        if(projectList.contains(project)) {
            throw new PortfolioException("This project already exists on list. Can`t be create!.");
        }
        return projectRepository.save(project);
    }

    // deleted project
    public void delete(Project project, List<Project> projectList) throws Exception {
        if(!projectList.contains(project)) {
            throw new PortfolioException("This project doesn`t exists on list. Can`t be delete!.");
        } else {
            projectRepository.delete(project);
        }
    }

    // update project
    public Project update(Project updatedProject, List<Project> projectList) throws Exception {
        Project existingProject = projectList.stream()
                .filter(project -> project.equals(updatedProject))
                .findFirst()
                .orElseThrow(() -> new PortfolioException("Project not found."));

        // Remove the old version and add the new one
        projectList.remove(existingProject);
        projectList.add(updatedProject);
        return updatedProject;
    }

    // read project
    // In ProjectService.java
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
        // If it's empty, it just returns [], which Angular handles gracefully
    }

    // Functional approach: Returns a NEW set with the updated item
    public List<Project> getUpdatedSet(Project updatedProject, List<Project> projectList) {
        return projectList.stream()
                .map(p -> p.equals(updatedProject) ? updatedProject : p)
                .collect(Collectors.toList());
    }
}
