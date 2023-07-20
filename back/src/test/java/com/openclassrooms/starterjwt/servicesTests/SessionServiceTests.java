package com.openclassrooms.starterjwt.servicesTests;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class) // JUnit 5
public class SessionServiceTests {

    @Mock
    SessionRepository sessionRepo; // mock the session repository

    @Mock
    UserRepository userRepo; // mock the user repository

    @InjectMocks
    SessionService sessionSrvc; // inject the session service

    private List<Session> sessionList; // beforeEach: create a list of sessions

    private Session session; // beforeEach: create a session

    private Teacher teacher; // beforeEach: create a teacher

    // create a teacher
    @BeforeEach
    public void CreateTeacher() {
        // we could directly get this teacher from table teacher, 
        // but we want this class to test solely the session service so we just create a teacher 
        this.teacher = new Teacher((long) 1, "DELAHAYE", "Margot", LocalDateTime.parse("2024-04-10T12:00:00"),
                LocalDateTime.parse("2024-04-10T12:00:00"));

    }

    // create a session
    @BeforeEach
    public void createSession() {
        this.session = new Session();
        this.session.setName("Session de yoga");
        this.session.setDescription("Venez pratiquer le yoga pour vous détendre");
        this.session.setTeacher(teacher);
        this.session.setUsers(new ArrayList<>());
    }

    // create a list of sessions
    @BeforeEach
    public void createSessionList() {
        this.sessionList = new ArrayList<>();

        // Création de deux utilisateurs
        List<User> users = new ArrayList<>();
        User u1 = new User();
        User u2 = new User();
        u1.setId((long) 1).setAdmin(false).setFirstName("Alice").setLastName("Johnson");
        u2.setId((long) 2).setAdmin(false).setFirstName("Bob").setLastName("Smith");

        users.add(u1);
        users.add(u2);

        // Création de deux sessions avec des données différentes
        sessionList.add(new Session((long) 1, "Session de yoga", new Date(),
                "Venez pratiquer le yoga pour vous détendre.",
                teacher, users, LocalDateTime.parse("2024-04-10T12:00:00"),
                LocalDateTime.parse("2024-04-10T12:00:00")));
        sessionList.add(new Session((long) 2, "Session de fitness", new Date(),
                "Rejoignez notre séance de fitness pour rester en forme.",
                teacher, users, LocalDateTime.parse("2024-04-10T12:00:00"),
                LocalDateTime.parse("2024-04-10T12:00:00")));
    }

    // test the create method of session service
    @Test
    public void shldCreateASession() {
        // GIVEN -- a session
        given(sessionRepo.save(session)).willReturn(session);

        // WHEN -- when create() is called on the session service, return the session
        Session receivedSession = sessionSrvc.create(session); // on crée la session

        // THEN
        // check that sessionsrepo findById is called once
        verify(sessionRepo, times(1)).save(session);
        assertThat(receivedSession).isEqualTo(session);

    }

    // test the findAll method of session service
    @Test
    public void shldFindAllAvailableSessions() {
        // GIVEN -- a list of sessions
        given(sessionRepo.findAll()).willReturn(sessionList);

        // WHEN -- when findAll() is called on the session service, return the session
        // list
        List<Session> receivedSessions = sessionSrvc.findAll();

        // THEN
        // check that sessionsrepo findById is called once
        verify(sessionRepo, times(1)).findAll();
        assertThat(receivedSessions).isEqualTo(sessionList);
    }

    // test the findById method of session service
    @Test
    public void shldFindASessionById() {
        // GIVEN -- a session
        given(sessionRepo.findById(1L)).willReturn(Optional.of(session));

        // WHEN -- when getById() is called on the session service, return the session
        Session receivedSession = sessionSrvc.getById(1L);

        // THEN
        // check that sessionsrepo findById is called once
        verify(sessionRepo, times(1)).findById(1L);
        assertThat(receivedSession).isEqualTo(session);
    }

    // test the update method of session service
    @Test
    public void shldUpdateASession() {
        // GIVEN -- a session
        Session session = sessionList.get(0);
        session.setName("Test");
        session.setDescription("Description Test");

        given(sessionRepo.save(session)).willReturn(sessionList.get(0));

        // WHEN -- when update() is called on the session service, return the session
        Session received = sessionSrvc.update((long) 1, session);

        // THEN
        // check that sessionsrepo findById is called once
        verify(sessionRepo, times(1)).save(session);
        assertThat(received).isEqualTo(session);
    }

    // test that the delete method of session service calls the deleteById method
    // with the right id
    @Test
    public void shldCallTheDeleteMethodWithRightId() {
        // GIVEN -- a session
        sessionSrvc.delete((long) 10);
        verify(sessionRepo).deleteById(10L);    // check that sessionsrepo deleteById is called once with the right id
    }

    // test that the participate method of session service calls the save method
    @Test
    public void ThrowNotFoundWhenParticipatingToUnkownSession() {
        // GIVEN
        given(sessionRepo.findById(1L)).willReturn(Optional.empty());

        // WHEN -- when participate() is called on an empty session, return the notfound
        // exception
        Assertions.assertThrows(NotFoundException.class, () -> sessionSrvc.participate(1L, 1L));


    }

    // test that a new participant is added to the session
    @Test
    public void AddANewParticipant() {
        // GIVEN
        int previousSize = sessionList.get(0).getUsers().size();
        given(sessionRepo.findById(3L)).willReturn(Optional.ofNullable(sessionList.get(0)));
        given(userRepo.findById(8L)).willReturn(Optional.of(new User()));

        // WHEN -- when participate() is called on the session, return the session with
        // the new participant
        sessionSrvc.participate(3L, 8L);

        // THEN : check that the size of the list of participants has increased by 1
        assertThat(sessionList.get(0).getUsers().size()).isEqualTo(previousSize + 1);
    }

}
