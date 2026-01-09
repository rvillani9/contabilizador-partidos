package com.example.contabilizador.service;

import com.example.contabilizador.model.Equipo;
import com.example.contabilizador.model.UsuarioEquipo;
import com.example.contabilizador.repository.EquipoRepository;
import com.example.contabilizador.repository.UsuarioEquipoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UsuarioEquipoService {
    private final UsuarioEquipoRepository usuarioEquipoRepository;
    private final EquipoRepository equipoRepository;

    public UsuarioEquipoService(UsuarioEquipoRepository usuarioEquipoRepository, EquipoRepository equipoRepository) {
        this.usuarioEquipoRepository = usuarioEquipoRepository;
        this.equipoRepository = equipoRepository;
    }

    public UsuarioEquipo asignarEquipo(Long usuarioId, Long equipoId, LocalDate desde) {
        Equipo equipo = equipoRepository.findById(equipoId).orElseThrow();
        UsuarioEquipo ue = UsuarioEquipo.builder().usuario(new com.example.contabilizador.model.Usuario())
                .equipo(equipo).desde(desde).build();
        ue.getUsuario().setId(usuarioId);
        return usuarioEquipoRepository.save(ue);
    }

    public List<UsuarioEquipo> historial(Long usuarioId) {
        return usuarioEquipoRepository.findByUsuarioId(usuarioId);
    }
}

