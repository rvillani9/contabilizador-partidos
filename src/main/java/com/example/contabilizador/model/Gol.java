package com.example.contabilizador.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"partido_id", "usuario_id", "equipo_id", "numero"})})
public class Gol {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Partido partido;

    @ManyToOne(optional = false)
    private Usuario usuario; // quien reclama el gol

    @ManyToOne(optional = false)
    private Equipo equipo; // para qué equipo fue el gol

    // opcionalmente, número de gol dentro del partido (1..n) para evitar duplicados
    private Integer numero;
}

