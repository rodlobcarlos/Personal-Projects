package com.project.myPortfolioBk.repository;

import com.project.myPortfolioBk.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // CRUD methods
}
