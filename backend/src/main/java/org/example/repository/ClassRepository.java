package org.example.repository;

import org.example.model.Class;
import org.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRepository extends JpaRepository<Class, Long> {
    List<Class> findByProfessor(User professor);
    List<Class> findByStudentsContaining(User student);
    List<Class> findByProfessorId(Long professorId);
}