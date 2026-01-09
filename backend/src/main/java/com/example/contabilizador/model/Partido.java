package com.example.contabilizador.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Partido {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Torneo torneo;

    private LocalDate fecha;

    // Nueva: instancia (Fase, Fecha, Semifinal, etc.)
    private String instancia;

    @ManyToOne(optional = false)
    private Equipo equipoLocal;
    @ManyToOne(optional = true)
    private Equipo equipoVisitante; // ahora opcional

    private Integer golesLocal;
    private Integer golesVisitante;

    // Usuario que cargó el partido
    @ManyToOne(optional = false)
    private Usuario cargadoPor;

    // Goles reclamados por usuarios
    @JsonIgnore
    @OneToMany(mappedBy = "partido", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Gol> golesReclamados = new HashSet<>();
}
