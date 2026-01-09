package com.example.contabilizador.repository;

import com.example.contabilizador.model.Gol;
import com.example.contabilizador.model.Usuario;
import com.example.contabilizador.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GolRepository extends JpaRepository<Gol, Long> {
    List<Gol> findByUsuarioId(Long usuarioId);

    @Query("select g.equipo.id, count(g) from Gol g where g.usuario.id = :usuarioId group by g.equipo.id")
    List<Object[]> conteoPorEquipo(Long usuarioId);
}

