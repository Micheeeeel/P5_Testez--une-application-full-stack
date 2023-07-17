package com.openclassrooms.starterjwt.controllerTests;

import com.jayway.jsonpath.JsonPath;
import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.services.TeacherService;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.CoreMatchers.is;


@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TeacherControllerTest {

    @Autowired
    MockMvc mockMvc;

    private String token;

    // @BeforeEach: get the token before each test
    @BeforeAll
    public void authenticate() throws Exception {
        // use the login endpoint with admin data to get the token
        String email = "yoga@studio.com";
        String password = "test!1234";
        String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andReturn();

        // extract the token from the response
        token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    @Test
    public void shldFindAllTeachers() throws Exception {
        // There should be 2 teachers in the list: the ones inserted by the script.sql file
        mockMvc.perform(get("/api/teacher/").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].lastName", is("DELAHAYE")))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].lastName", is("THIERCELIN"))
                );

    }

    @Test
    public void shldFindTeacherById() throws Exception {
        // there should be a teacher with id 1 with name DELAHAYE according to the script.sql file
        mockMvc.perform(get("/api/teacher/1").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("lastName", is("DELAHAYE")) );
    }

    @Test
    public void testFindTeacherByIdNotFound() throws Exception {
        Long teacherId = 345L;

        mockMvc.perform(get("/api/teacher/{id}", teacherId).header("Authorization", token))
                .andExpect(status().isNotFound());

    }
}
