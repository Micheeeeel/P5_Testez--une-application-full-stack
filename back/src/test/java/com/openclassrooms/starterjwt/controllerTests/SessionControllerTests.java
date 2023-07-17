package com.openclassrooms.starterjwt.controllerTests;

import com.jayway.jsonpath.JsonPath;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class SessionControllerTests {
    @Autowired
    MockMvc mockMvc;

    private String token;

    @BeforeAll
    public void getToken() throws Exception {
        // Arrange -- créer un compte admin
        String email = "yoga@studio.com";
        String password = "test!1234";
        String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

        // récupérer le token
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andReturn();

        token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    @BeforeEach
    // création d'une session
    public void createSession() throws Exception {
        // Arrange -- create a session
        String name = "First Session";
        long teacherID = 1L;
        String description = "description example";
        String date = "2023-01-01";

        String body = "{" +
                "\"name\": \"" + name + "\"," +
                "\"teacher_id\":" + teacherID + "," +
                "\"description\":\"" + description + "\"," +
                "\"date\":\"" + date + "\"}";

        // Act -- simulate a post request to the route /api/session/
        ResultActions result = mockMvc.perform(post("/api/session/")
                .contentType(MediaType.APPLICATION_JSON).content(body)
                .header("Authorization", token));
        // Assert -- assert that the status is 200 and that the returned name is the
        // same
        result.andExpect(status().isOk())
                .andExpect(jsonPath("name", is(name)));
    }

    @AfterEach
    // suppréssion de la session
    public void deleteSession() throws Exception {
        // Arrange -- identifier l'id de la session à supprimer
        ResultActions resultGet = mockMvc.perform(get("/api/session/").header("Authorization", token));
        String content = resultGet.andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(content, "$[0].id");

        // Act -- simulate a delete request to the route /api/session/id
        ResultActions result = mockMvc.perform(delete("/api/session/" + id).header("Authorization", token));
        // Assert -- assert that the status is 200
        result.andExpect(status().isOk());
    }

    // Test de la route /api/session/
    @Test
    public void itShouldGetAllSessions() throws Exception {
        // Act -- simulate a get request to the route /api/session/
        ResultActions result = mockMvc.perform(get("/api/session/").header("Authorization", token));
        // Assert -- assert that the status is 200
        result.andExpect(status().isOk());

    }

    // tester la route /api/session/{id}
    @Test
    public void itShldGetOneSession() throws Exception {
        // Arrange -- identifier l'id de la session à supprimer
        ResultActions resultGet = mockMvc.perform(get("/api/session/").header("Authorization", token));
        String content = resultGet.andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(content, "$[0].id");

        // Act -- simulate a get request to the route /api/session/id
        ResultActions result = mockMvc.perform(get("/api/session/" + id).header("Authorization", token));
        // Assert -- assert that the status is 200
        result.andExpect(status().isOk());
    }

    @Test
    public void itShldthrowAnExceptionWhenGettingInvalidUrl() throws Exception {
        // Act -- simulate a get request to the route /api/session/Invalid
        ResultActions result = mockMvc.perform(get("/api/session/Invalid").header("Authorization", token));
        // Assert -- simulate a get request to the route /api/session/Invalid
        result.andExpect(status().isBadRequest());
    }

    // tester la modification d'une session
    @Test
    public void itShldUpdateSession() throws Exception {
        // Arrange -- create a session
        String name = "Updated session example";
        long teacherID = 1L;
        String description = "description example";
        String date = "2023-01-01";

        String body = "{" +
                "\"name\": \"" + name + "\"," +
                "\"teacher_id\":" + teacherID + "," +
                "\"description\":\"" + description + "\"," +
                "\"date\":\"" + date + "\"}";

        // Arrange -- identifier l'id de la session à supprimer
        ResultActions resultGet = mockMvc.perform(get("/api/session/").header("Authorization", token));
        String content = resultGet.andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(content, "$[0].id");

        // Act -- simulate a post request to the route /api/session/
        ResultActions result = mockMvc.perform(put("/api/session/" + id) // 1 because we already created a session with
                                                                         // id
                // 1 into previous test
                .contentType(MediaType.APPLICATION_JSON).content(body)
                .header("Authorization", token));
        // Assert -- assert that the status is 200 and that the returned name is the new
        // one
        result.andExpect(status().isOk())
                .andExpect(jsonPath("name", is(name)));
    }

    // tester la route /api/session/{id}/participate
    @Test
    public void itShldParticipate() throws Exception {
        // Arrange -- identifier l'id de la session à supprimer
        ResultActions resultGet = mockMvc.perform(get("/api/session/").header("Authorization", token));
        String content = resultGet.andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(content, "$[0].id");

        // Act -- simulate a post request to the route /api/session/id/participate
        ResultActions result = mockMvc
                .perform(post("/api/session/" + id + "/participate/1").header("Authorization", token));
        // Assert -- assert that the status is 200
        result.andExpect(status().isOk());
    }

    // tester la désinscription d'une session
    @Test
    public void itShldNoLongerParticipate() throws Exception {

        itShldParticipate();

        // Arrange -- identifier l'id de la session à supprimer
        ResultActions resultGet = mockMvc.perform(get("/api/session/").header("Authorization", token));
        String content = resultGet.andReturn().getResponse().getContentAsString();
        int id = JsonPath.read(content, "$[0].id");

        // Act -- simulate a delete request to the route /api/session/id/participate/1
        ResultActions result = mockMvc
                .perform(delete("/api/session/" + id + "/participate/1").header("Authorization", token));
        // Assert -- assert that the status is 200
        result.andExpect(status().isOk());
    }

    // tester la suppression d'un compte n'existant pas
    @Test
    public void itShldThrowAnExceptionWhenDeletingInvalidSession() throws Exception {
        // Act -- simulate a delete request to the route /api/session/1
        ResultActions result = mockMvc.perform(delete("/api/session/0").header("Authorization", token));
        // Assert -- assert that the status is 404
        result.andExpect(status().isNotFound());
    }

    // tester la suppression d'un compte avec un id invalide
    @Test
    public void itShldThrowAnExceptionWhenDeletingSessionWithInvalidId() throws Exception {
        // Act -- simulate a delete request to the route /api/session/1
        ResultActions result = mockMvc.perform(delete("/api/session/invalid").header("Authorization", token));
        // Assert -- assert that the status is 400
        result.andExpect(status().isBadRequest());
    }

}
