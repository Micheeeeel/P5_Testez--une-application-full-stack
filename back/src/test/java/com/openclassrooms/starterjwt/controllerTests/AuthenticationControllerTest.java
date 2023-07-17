package com.openclassrooms.starterjwt.controllerTests;

import com.jayway.jsonpath.JsonPath;
import org.aspectj.lang.annotation.After;
import org.junit.jupiter.api.AfterAll;
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

import static org.hamcrest.CoreMatchers.is;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AuthenticationControllerTest {

        @Autowired
        MockMvc mockMvc;

        // Test qui vérifie si l'utilisateur admin peut se connecter
        @Test
        public void itShldLoginAdmin() throws Exception {
                String email = "yoga@studio.com";
                String password = "test!1234";
                String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk());
        }

        // Test qui vérifie qu'un utilisateur non enregistré ne peut pas se connecter
        @Test
        public void itShldNotLoginUnregisteredUser() throws Exception {
                String email = "stillNotRegisterUser@gmail.com";
                String password = "wrongPassword";
                String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isUnauthorized());
        }

        // Test qui vérifie qu'un nouvelle utilisateur peut s'enregistrer
        @Test
        public void itShldRegisterNewUser() throws Exception {
                String email = "toto@gmail.com";
                String password = "toto!12345";
                String lastName = "toto";
                String firstName = "toto";
                String requestBody = "{" +
                                "\"email\": \"" + email + "\"," +
                                "\"password\": \"" + password + "\"," +
                                "\"firstName\": \"" + firstName + "\"," +
                                "\"lastName\": \"" + lastName + "\"" +
                                "}";

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("message", is("User registered successfully!")));
        }

        // Test qui vérifie qu'un utilisateur déjà présent dans la base de données ne
        // peut pas s'enregistrer
        @Test
        public void itShldNotRegisterExistingUser() throws Exception {
                String email = "toto@gmail.com";
                String password = "toto!12345";
                String lastName = "toto";
                String firstName = "toto";
                String requestBody = "{" +
                                "\"email\": \"" + email + "\"," +
                                "\"password\": \"" + password + "\"," +
                                "\"firstName\": \"" + firstName + "\"," +
                                "\"lastName\": \"" + lastName + "\"" +
                                "}";

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isBadRequest());
        }

        @AfterAll
        public void cleanup() throws Exception {
                // delete the user created in the register method
                String email = "toto@gmail.com";
                String password = "toto!12345";
                // login to get the token
                String request = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";
                MvcResult result = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request))
                                .andReturn();

                String content = result.getResponse().getContentAsString();
                String token = JsonPath.read(content, "$.token");
                int id = JsonPath.read(content, "$.id"); // get the id of the user
                // delete the user
                mockMvc.perform(delete("/api/user/" + id).header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk());
        }

}
