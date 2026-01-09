package com.example.contabilizador.repository;

import com.example.contabilizador.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    List<Equipo> findByNombreContainingIgnoreCase(String nombre);
    Optional<Equipo> findByNombreIgnoreCase(String nombre);
}
