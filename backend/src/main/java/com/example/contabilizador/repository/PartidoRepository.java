package com.example.contabilizador.repository;

import com.example.contabilizador.model.Partido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartidoRepository extends JpaRepository<Partido, Long> {
    List<Partido> findByEquipoLocal_Id(Long equipoLocalId);
}
