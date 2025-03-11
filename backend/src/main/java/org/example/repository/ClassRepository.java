package org.example.repository;

import org.example.model.Class;
import org.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClassRepository extends JpaRepository<Class, Long> {
    List<Class> findByProfessor(User professor);
    List<Class> findByStudentsContaining(User student);
    List<Class> findByProfessorId(Long professorId);

    @Modifying
    @Query(value = "DELETE FROM class_students WHERE student_id = :studentId", nativeQuery = true)
    void removeStudentFromAllClasses(Long studentId);
}