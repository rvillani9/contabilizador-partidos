package com.example.contabilizador.service;

import com.example.contabilizador.model.*;
import com.example.contabilizador.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
                                int golesVisitante, Long cargadoPorId, String visitanteNombreOptional) {
        if (golesLocal < 0 || golesVisitante < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Los goles no pueden ser negativos");
        }
        if (visitanteId != null && localId.equals(visitanteId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El equipo local y visitante no pueden ser el mismo");
        }

        Torneo torneo = torneoRepository.findById(torneoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Torneo no encontrado"));
        Equipo local = equipoRepository.findById(localId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo local no encontrado"));

        Equipo visitante = null;
        if (visitanteId != null) {
            visitante = equipoRepository.findById(visitanteId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo visitante no encontrado"));
        } else if (visitanteNombreOptional != null && !visitanteNombreOptional.isBlank()) {
            // Intentar reutilizar si existe por nombre (case-insensitive), si no, crear
            visitante = equipoRepository.findByNombreIgnoreCase(visitanteNombreOptional.trim())
                    .orElseGet(() -> equipoRepository.save(Equipo.builder().nombre(visitanteNombreOptional.trim()).build()));
            if (visitante.getId().equals(local.getId())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El equipo local y visitante no pueden ser el mismo");
            }
        }

        Usuario cargadoPor = usuarioRepository.findById(cargadoPorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario (cargadoPor) no encontrado"));

        Partido p = Partido.builder()
                .torneo(torneo)
                .equipoLocal(local)
                .equipoVisitante(visitante)
                .fecha(fecha.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate())
                .golesLocal(golesLocal)
                .golesVisitante(golesVisitante)
                .cargadoPor(cargadoPor)
                .build();
        return partidoRepository.save(p);
    }

    @Transactional
    public Gol reclamarGol(Long partidoId, Long usuarioId, Long equipoId, Integer numeroOptional) {
        Partido partido = partidoRepository.findById(partidoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partido no encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado"));

        // Validar que el equipo corresponda al partido
        if (!equipo.getId().equals(partido.getEquipoLocal().getId()) &&
            !equipo.getId().equals(partido.getEquipoVisitante().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El equipo no pertenece al partido");
        }

        // Si se provee número, evitar duplicados dentro del mismo partido/equipo
        if (numeroOptional != null) {
            // Buscar si ya existe un gol con ese número para el mismo partido/equipo/usuario
            // La entidad ya tiene una restricción única (partido, usuario, equipo, numero),
            // pero damos un mensaje claro antes de que falle por DB.
            Optional<Gol> existente = golRepository.findAll().stream()
                    .filter(g -> Objects.equals(g.getPartido().getId(), partidoId)
                            && Objects.equals(g.getEquipo().getId(), equipoId)
                            && Objects.equals(g.getUsuario().getId(), usuarioId)
                            && Objects.equals(g.getNumero(), numeroOptional))
                    .findFirst();
            if (existente.isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un gol con ese número para este partido/equipo/usuario");
            }
        }

        return golRepository.save(Gol.builder().partido(partido).usuario(usuario).equipo(equipo).numero(numeroOptional).build());
    }

    @Transactional
    public List<Gol> reclamarGolMultiple(Long partidoId, Long usuarioId, Long equipoId, Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cantidad debe ser mayor a cero");
        }
        Partido partido = partidoRepository.findById(partidoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partido no encontrado"));
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado"));
        if (equipo.getId() == null || (!equipo.getId().equals(partido.getEquipoLocal().getId()) &&
                (partido.getEquipoVisitante() == null || !equipo.getId().equals(partido.getEquipoVisitante().getId())))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El equipo no pertenece al partido");
        }
        List<Gol> creado = new ArrayList<>();
        for (int i = 0; i < cantidad; i++) {
            Gol g = Gol.builder().partido(partido).usuario(usuario).equipo(equipo).numero(null).build();
            creado.add(golRepository.save(g));
        }
        return creado;
    }
}
