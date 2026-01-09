package com.example.contabilizador.repository;

import com.example.contabilizador.model.Gol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GolRepository extends JpaRepository<Gol, Long> {
    List<Gol> findByUsuarioId(Long usuarioId);

    @Query("select g.equipo.id, count(g) from Gol g where g.usuario.id = :usuarioId group by g.equipo.id")
    List<Object[]> conteoPorEquipo(Long usuarioId);

    @Query("select g.usuario.id as usuarioId, count(g) as goles from Gol g group by g.usuario.id")
    List<Object[]> rankingGoles();

    @Query("select g.usuario.id as usuarioId, count(distinct g.partido.id) as partidosJugados from Gol g group by g.usuario.id")
    List<Object[]> rankingPartidosJugados();
}
