package com.example.contabilizador.service;

import com.example.contabilizador.model.*;
import com.example.contabilizador.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PartidoService {
    private final PartidoRepository partidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EquipoRepository equipoRepository;
    private final TorneoRepository torneoRepository;
    private final GolRepository golRepository;

    public PartidoService(PartidoRepository partidoRepository, UsuarioRepository usuarioRepository,
                          EquipoRepository equipoRepository, TorneoRepository torneoRepository,
                          GolRepository golRepository) {
        this.partidoRepository = partidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.equipoRepository = equipoRepository;
        this.torneoRepository = torneoRepository;
        this.golRepository = golRepository;
    }

    @Transactional
    public Partido crearPartido(Long torneoId, Long localId, Long visitanteId, Date fecha, int golesLocal,
                                int golesVisitante) {
        Torneo torneo = torneoRepository.findById(torneoId).orElseThrow();
        Equipo local = equipoRepository.findById(localId).orElseThrow();
        Equipo visitante = equipoRepository.findById(visitanteId).orElseThrow();
        Partido p = Partido.builder()
                .torneo(torneo)
                .equipoLocal(local)
                .equipoVisitante(visitante)
                .fecha(fecha.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate())
                .golesLocal(golesLocal)
                .golesVisitante(golesVisitante)
                .build();
        return partidoRepository.save(p);
    }

    @Transactional
    public Gol reclamarGol(Long partidoId, Long usuarioId, Long equipoId, Integer numeroOptional) {
        Partido partido = partidoRepository.findById(partidoId).orElseThrow();
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow();
        Equipo equipo = equipoRepository.findById(equipoId).orElseThrow();
        Gol gol = Gol.builder().partido(partido).usuario(usuario).equipo(equipo).numero(numeroOptional).build();
        return golRepository.save(gol);
    }
}

