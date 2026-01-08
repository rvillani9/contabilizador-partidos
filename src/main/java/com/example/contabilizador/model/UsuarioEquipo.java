package com.example.contabilizador.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"usuario_id","equipo_id","desde"})})
public class UsuarioEquipo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    private Equipo equipo;

    private LocalDate desde;
    private LocalDate hasta; // null si sigue vigente
}

