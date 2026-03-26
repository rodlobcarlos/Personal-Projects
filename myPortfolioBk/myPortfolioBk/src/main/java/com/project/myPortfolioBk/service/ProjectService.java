package com.project.myPortfolioBk.service;

import com.project.myPortfolioBk.exception.PortfolioException;
import com.project.myPortfolioBk.model.Project;
import com.project.myPortfolioBk.repository.ProjectRepository;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Data // automatic getters and setters
public class ProjectService {

    // logger
    private static final Logger logger = LogManager.getLogger(ProjectService.class);
    // repository class
    private ProjectRepository projectRepository;

    // save new project
    public Project create(Project project, Set<Project> projectSet) throws Exception {
        if(projectSet.contains(project)) {
            throw new PortfolioException("This project already exists on list. Can`t be create!.");
        }
        return projectRepository.save(project);
    }

    // deleted project
    public void delete(Project project, Set<Project> projectSet) throws Exception {
        if(!projectSet.contains(project)) {
            throw new PortfolioException("This project doesn`t exists on list. Can`t be delete!.");
        } else {
            projectRepository.delete(project);
        }
    }

    // update project
    public Project update(Project updatedProject, Set<Project> projectSet) throws Exception {
        Project existingProject = projectSet.stream()
                .filter(project -> project.equals(updatedProject))
                .findFirst()
                .orElseThrow(() -> new PortfolioException("Project not found."));

        // Remove the old version and add the new one
        projectSet.remove(existingProject);
        projectSet.add(updatedProject);
        return updatedProject;
    }

    // read project
    public Set<Project> getAllProjects() {
        Set<Project> projectSet = new HashSet<>();
        if (!projectSet.isEmpty()) {
            for (Project project : projectSet) {
                logger.info(project);
            }
        } else {
            throw new PortfolioException("This list doesn`t have any project. Is empty!!");
        }
        return projectSet;
    }

    // Functional approach: Returns a NEW set with the updated item
    public Set<Project> getUpdatedSet(Project updatedProject, Set<Project> projectSet) {
        return projectSet.stream()
                .map(p -> p.equals(updatedProject) ? updatedProject : p)
                .collect(Collectors.toSet());
    }
}
