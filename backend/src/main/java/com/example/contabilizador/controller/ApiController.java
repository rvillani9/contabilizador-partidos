package com.example.contabilizador.controller;

import com.example.contabilizador.model.*;
import com.example.contabilizador.repository.*;
import com.example.contabilizador.service.PartidoService;
import com.example.contabilizador.service.ResumenService;
import com.example.contabilizador.service.UsuarioEquipoService;
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
    private final GolRepository golRepository;
    private final PartidoService partidoService;
    private final UsuarioEquipoService usuarioEquipoService;
    private final ResumenService resumenService;

    public ApiController(UsuarioRepository usuarioRepository, EquipoRepository equipoRepository,
                         TorneoRepository torneoRepository, PartidoRepository partidoRepository,
                         GolRepository golRepository,
                         PartidoService partidoService, UsuarioEquipoService usuarioEquipoService,
                         ResumenService resumenService) {
        this.usuarioRepository = usuarioRepository;
        this.equipoRepository = equipoRepository;
        this.torneoRepository = torneoRepository;
        this.partidoRepository = partidoRepository;
        this.golRepository = golRepository;
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
    @GetMapping("/equipos/buscar")
    public List<Equipo> buscarEquipos(@RequestParam String nombre) { return equipoRepository.findByNombreContainingIgnoreCase(nombre); }

    @PostMapping("/torneos")
    public Torneo crearTorneo(@RequestBody Torneo t) { return torneoRepository.save(t); }
    @GetMapping("/torneos")
    public List<Torneo> listarTorneos() { return torneoRepository.findAll(); }

    // Partidos y goles
    @PostMapping("/partidos")
    public Partido crearPartido(@RequestParam Long torneoId,
                                @RequestParam Long localId,
                                @RequestParam(required = false) Long visitanteId,
                                @RequestParam(required = false) String visitanteNombre,
                                @RequestParam String instancia,
                                @RequestParam int golesLocal,
                                @RequestParam int golesVisitante,
                                @RequestParam Long cargadoPorId) {
        return partidoService.crearPartido(torneoId, localId, visitanteId, new Date(), golesLocal, golesVisitante, cargadoPorId, visitanteNombre, instancia);
    }

    @GetMapping("/partidos")
    public List<Partido> listarPartidos(@RequestParam(required = false) Long localId) {
        if (localId != null) {
            return partidoRepository.findByEquipoLocal_Id(localId);
        }
        return partidoRepository.findAll();
    }

    @PostMapping("/partidos/{partidoId}/reclamar-gol")
    public Gol reclamarGol(@PathVariable("partidoId") Long partidoId,
                           @RequestParam Long usuarioId,
                           @RequestParam Long equipoId,
                           @RequestParam(required = false) Integer numero) {
        return partidoService.reclamarGol(partidoId, usuarioId, equipoId, numero);
    }

    @PostMapping("/partidos/{partidoId}/reclamar-goles")
    public List<Gol> reclamarGoles(@PathVariable("partidoId") Long partidoId,
                                   @RequestParam Long usuarioId,
                                   @RequestParam Long equipoId,
                                   @RequestParam Integer cantidad) {
        return partidoService.reclamarGolMultiple(partidoId, usuarioId, equipoId, cantidad);
    }

    // Pertenencias y resumen
    @PostMapping("/usuarios/{usuarioId}/pertenencias")
    public UsuarioEquipo asignar(@PathVariable("usuarioId") Long usuarioId, @RequestParam Long equipoId,
                                 @RequestParam String desde) {
        return usuarioEquipoService.asignarEquipo(usuarioId, equipoId, LocalDate.parse(desde));
    }
    @GetMapping("/usuarios/{usuarioId}/pertenencias")
    public List<UsuarioEquipo> historial(@PathVariable("usuarioId") Long usuarioId) { return usuarioEquipoService.historial(usuarioId); }

    @GetMapping("/usuarios/{usuarioId}/resumen")
    public Map<String, Object> resumen(@PathVariable("usuarioId") Long usuarioId) { return resumenService.resumenUsuario(usuarioId); }

    @GetMapping("/ranking-usuarios")
    public List<Map<String, Object>> rankingUsuarios(@RequestParam(defaultValue = "goles") String ordenarPor) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        Map<Long, String> nombres = new java.util.HashMap<>();
        for (Usuario u : usuarios) nombres.put(u.getId(), u.getNombre());

        List<Object[]> goles = golRepository.rankingGoles();
        List<Object[]> partidos = golRepository.rankingPartidosJugados();

        java.util.Map<Long, Long> mapGoles = new java.util.HashMap<>();
        for (Object[] row : goles) mapGoles.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        java.util.Map<Long, Long> mapPartidos = new java.util.HashMap<>();
        for (Object[] row : partidos) mapPartidos.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());

        java.util.Set<Long> ids = new java.util.HashSet<>();
        ids.addAll(mapGoles.keySet());
        ids.addAll(mapPartidos.keySet());

        java.util.List<Map<String, Object>> out = new java.util.ArrayList<>();
        for (Long id : ids) {
            java.util.Map<String, Object> m = new java.util.HashMap<>();
            m.put("usuarioId", id);
            m.put("nombre", nombres.getOrDefault(id, "(desconocido)"));
            m.put("goles", mapGoles.getOrDefault(id, 0L));
            m.put("partidos", mapPartidos.getOrDefault(id, 0L));
            out.add(m);
        }

        out.sort((a,b) -> {
            if ("partidos".equalsIgnoreCase(ordenarPor)) {
                return Long.compare(((Number)b.get("partidos")).longValue(), ((Number)a.get("partidos")).longValue());
            }
            return Long.compare(((Number)b.get("goles")).longValue(), ((Number)a.get("goles")).longValue());
        });
        return out;
    }
}
