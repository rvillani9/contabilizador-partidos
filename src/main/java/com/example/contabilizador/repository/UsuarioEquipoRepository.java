package com.example.contabilizador.repository;

import com.example.contabilizador.model.UsuarioEquipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioEquipoRepository extends JpaRepository<UsuarioEquipo, Long> {
    List<UsuarioEquipo> findByUsuarioId(Long usuarioId);
}

