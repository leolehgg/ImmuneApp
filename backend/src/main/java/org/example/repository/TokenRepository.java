package org.example.repository;

import org.example.model.Token;
import org.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {


    @Query(value = "SELECT * FROM token t WHERE t.user_id = :id AND (t.expired = false OR t.revoked = false)", nativeQuery = true)
    List<Token> findAllValidTokenByUser(@Param("id") Long id);


    Optional<Token> findByToken(String token);

    void deleteByUser(User user); // Método para eliminar tokens por usuario

}
