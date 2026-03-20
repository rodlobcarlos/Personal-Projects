package com.project.myPortfolioBk.service;

import com.project.myPortfolioBk.model.Project;
import com.project.myPortfolioBk.repository.ProjectRepository;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.Set;

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
            throw new Exception("This project already exists on list. Can`t be create!.");
        }
        return projectRepository.save(project);
    }

    // deleted project
    public void delete(Project project, Set<Project> projectSet) throws Exception {
        if(!projectSet.contains(project)) {
            throw new Exception("This project doesn`t exists on list. Can`t be delete!.");
        } else {
            projectRepository.delete(project);
        }
    }

    // update project
    // REVIEW
    public Project update(Project project, Set<Project> projectSet) throws Exception {
        Project project1 = null;
        if(!projectSet.contains(project)) {
            throw new Exception("This project doesn`t exists on list. Can`t be update!.");
        }
        project1 = project;
        return project1;
    }

    // read project
    public void read(Set<Project> projectSet) {
        for (Project project: projectSet) {
            logger.info(project);
        }
    }
}
