package com.example.contabilizador.controller;

import com.example.contabilizador.model.*;
import com.example.contabilizador.repository.*;
import com.example.contabilizador.service.PartidoService;
import com.example.contabilizador.service.ResumenService;
import com.example.contabilizador.service.UsuarioEquipoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ApiController {
    private final UsuarioRepository usuarioRepository;
    private final EquipoRepository equipoRepository;
    private final TorneoRepository torneoRepository;
    private final PartidoRepository partidoRepository;
    private final PartidoService partidoService;
    private final UsuarioEquipoService usuarioEquipoService;
    private final ResumenService resumenService;

    public ApiController(UsuarioRepository usuarioRepository, EquipoRepository equipoRepository,
                         TorneoRepository torneoRepository, PartidoRepository partidoRepository,
                         PartidoService partidoService, UsuarioEquipoService usuarioEquipoService,
                         ResumenService resumenService) {
        this.usuarioRepository = usuarioRepository;
        this.equipoRepository = equipoRepository;
        this.torneoRepository = torneoRepository;
        this.partidoRepository = partidoRepository;
        this.partidoService = partidoService;
        this.usuarioEquipoService = usuarioEquipoService;
        this.resumenService = resumenService;
    }

    // CRUD básicos
    @PostMapping("/usuarios")
    public Usuario crearUsuario(@RequestBody Usuario u) { return usuarioRepository.save(u); }
    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() { return usuarioRepository.findAll(); }

    @PostMapping("/equipos")
    public Equipo crearEquipo(@RequestBody Equipo e) { return equipoRepository.save(e); }
    @GetMapping("/equipos")
    public List<Equipo> listarEquipos() { return equipoRepository.findAll(); }

    @PostMapping("/torneos")
    public Torneo crearTorneo(@RequestBody Torneo t) { return torneoRepository.save(t); }
    @GetMapping("/torneos")
    public List<Torneo> listarTorneos() { return torneoRepository.findAll(); }

    // Partidos y goles
    @PostMapping("/partidos")
    public Partido crearPartido(@RequestParam Long torneoId,
                                @RequestParam Long localId,
                                @RequestParam Long visitanteId,
                                @RequestParam Long cargadoPorId,
                                @RequestParam int golesLocal,
                                @RequestParam int golesVisitante) {
        return partidoService.crearPartido(torneoId, localId, visitanteId, new Date(), golesLocal, golesVisitante, cargadoPorId);
    }

    @GetMapping("/partidos")
    public List<Partido> listarPartidos() { return partidoRepository.findAll(); }

    @PostMapping("/partidos/{partidoId}/reclamar-gol")
    public Gol reclamarGol(@PathVariable Long partidoId,
                           @RequestParam Long usuarioId,
                           @RequestParam Long equipoId,
                           @RequestParam(required = false) Integer numero) {
        return partidoService.reclamarGol(partidoId, usuarioId, equipoId, numero);
    }

    // Pertenencias y resumen
    @PostMapping("/usuarios/{usuarioId}/pertenencias")
    public UsuarioEquipo asignar(@PathVariable Long usuarioId, @RequestParam Long equipoId,
                                 @RequestParam String desde) {
        return usuarioEquipoService.asignarEquipo(usuarioId, equipoId, LocalDate.parse(desde));
    }
    @GetMapping("/usuarios/{usuarioId}/pertenencias")
    public List<UsuarioEquipo> historial(@PathVariable Long usuarioId) { return usuarioEquipoService.historial(usuarioId); }

    @GetMapping("/usuarios/{usuarioId}/resumen")
    public Map<String, Object> resumen(@PathVariable Long usuarioId) { return resumenService.resumenUsuario(usuarioId); }
}
