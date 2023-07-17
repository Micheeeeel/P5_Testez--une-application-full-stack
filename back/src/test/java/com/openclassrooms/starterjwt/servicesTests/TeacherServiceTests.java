package com.openclassrooms.starterjwt.servicesTests;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTests {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;


    //  vérifier que la liste de teachers est bien retournée
    @Test
    public void testFindAllTeachers() {
        
        // Créer une liste de teachers simulée
        List<Teacher> teachers = new ArrayList<>();

        teachers.add(new Teacher((long)1, "Michel", "Thomas", LocalDateTime.parse("2024-04-10T12:00:00"), LocalDateTime.parse("2024-04-10T12:00:00")));
        teachers.add(new Teacher((long)2, "Dupont", "Alexandre", LocalDateTime.parse("2024-04-10T12:00:00"), LocalDateTime.parse("2024-04-10T12:00:00")));

        // Configurer le comportement simulé du repository pour qu'il renvoie la liste simulée
        when(teacherRepository.findAll()).thenReturn(teachers);

        // Appeler la méthode du service à tester
        List<Teacher> result = teacherService.findAll();

        // Comparer le résultat avec le résultat attendu
        assertEquals(teachers.size(), result.size());
        assertEquals(teachers.get(0), result.get(0));
        assertEquals(teachers.get(1), result.get(1));

        // Vérifier que la méthode du repository a été appelée
        verify(teacherRepository, times(1)).findAll();
    }

    // vérifier que le teacher est bien retourné
    @Test
    public void testFindTeacherById() {
        // Créer un teacher simulé
        Teacher teacher = new Teacher((long)1, "Michel", "Thomas", LocalDateTime.parse("2024-04-10T12:00:00"), LocalDateTime.parse("2024-04-10T12:00:00"));

        // Configurer le comportement simulé du repository pour qu'il renvoie ce teacher
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        // Appeler la méthode du service à tester
        Teacher result = teacherService.findById(1L);

        // Vérifier le résultat
        assertEquals(teacher, result);

        // Vérifier que la méthode du repository a été appelée
        verify(teacherRepository, times(1)).findById(1L);
    }


    // vérifier que un teacher non existant retourne null
    @Test
    public void testFindTeacherByIdNotFound() {
        // Configurer le comportement simulé du repository pour qu'il renvoie null
        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());

        // Appeler la méthode du service à tester
        Teacher result = teacherService.findById(1L);

        // Vérifier le résultat
        assertEquals(null, result);

        // Vérifier que la méthode du repository a été appelée
        verify(teacherRepository, times(1)).findById(1L);
    }
}
