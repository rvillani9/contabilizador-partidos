package com.example.contabilizador.service;

import com.example.contabilizador.model.Equipo;
import com.example.contabilizador.model.Gol;
import com.example.contabilizador.model.Usuario;
import com.example.contabilizador.repository.EquipoRepository;
import com.example.contabilizador.repository.GolRepository;
import com.example.contabilizador.repository.PartidoRepository;
import com.example.contabilizador.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ResumenService {
    private final GolRepository golRepository;
    private final EquipoRepository equipoRepository;
    private final PartidoRepository partidoRepository;
    private final UsuarioRepository usuarioRepository;

    public ResumenService(GolRepository golRepository, EquipoRepository equipoRepository,
                          PartidoRepository partidoRepository, UsuarioRepository usuarioRepository) {
        this.golRepository = golRepository;
        this.equipoRepository = equipoRepository;
        this.partidoRepository = partidoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Map<String, Object> resumenUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow();
        List<Gol> goles = golRepository.findByUsuarioId(usuarioId);
        Map<Long, Integer> golesPorEquipo = new HashMap<>();
        for (Gol g : goles) {
            golesPorEquipo.merge(g.getEquipo().getId(), 1, Integer::sum);
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("usuario", usuario.getNombre());
        resp.put("totalGoles", goles.size());
        Map<String, Integer> porEquipo = new HashMap<>();
        for (Map.Entry<Long, Integer> e : golesPorEquipo.entrySet()) {
            String nombreEquipo = equipoRepository.findById(e.getKey()).map(Equipo::getNombre).orElse("?");
            porEquipo.put(nombreEquipo, e.getValue());
        }
        resp.put("golesPorEquipo", porEquipo);
        // Partidos jugados por equipo: contamos partidos donde reclamó gol para ese equipo
        Map<String, Integer> partidosPorEquipo = new HashMap<>();
        goles.stream().map(g -> g.getEquipo().getNombre()).distinct().forEach(eq -> {
            int count = (int) goles.stream().filter(g -> g.getEquipo().getNombre().equals(eq)).map(Gol::getPartido).distinct().count();
            partidosPorEquipo.put(eq, count);
        });
        resp.put("partidosPorEquipo", partidosPorEquipo);
        resp.put("totalPartidos", (int) goles.stream().map(Gol::getPartido).distinct().count());
        return resp;
    }
}

