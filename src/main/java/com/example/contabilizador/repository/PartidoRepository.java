package com.example.contabilizador.repository;

import com.example.contabilizador.model.Partido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartidoRepository extends JpaRepository<Partido, Long> {
}

