package com.project.myPortfolioBk.service;

import com.project.myPortfolioBk.exception.PortfolioException;
import com.project.myPortfolioBk.model.Project;
import com.project.myPortfolioBk.repository.ProjectRepository;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
public class ProjectService {

    private static final Logger logger = LogManager.getLogger(ProjectService.class);
    private ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project create(Project project) throws Exception {
        List<Project> existingProjects = projectRepository.findAll();
        if (existingProjects.contains(project)) {
            throw new PortfolioException("This project already exists on list. Can't be created.");
        }
        return projectRepository.save(project);
    }

    public void delete(Long id) throws Exception {
        if (!projectRepository.existsById(id)) {
            throw new PortfolioException("Project not found. Can't be deleted.");
        }
        projectRepository.deleteById(id);
    }

    public Project update(Long id, Project updatedProject) throws Exception {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new PortfolioException("Project not found."));

        existingProject.setTitle(updatedProject.getTitle());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setTechStack(updatedProject.getTechStack());
        existingProject.setGithub_url(updatedProject.getGithub_url());

        return projectRepository.save(existingProject);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}
