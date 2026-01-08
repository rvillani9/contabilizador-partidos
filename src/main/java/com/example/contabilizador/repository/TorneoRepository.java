package com.example.contabilizador.repository;

import com.example.contabilizador.model.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TorneoRepository extends JpaRepository<Torneo, Long> {
}

