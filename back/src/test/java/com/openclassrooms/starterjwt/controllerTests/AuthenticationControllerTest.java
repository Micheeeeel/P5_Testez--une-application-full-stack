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

@SpringBootTest // permet de charger le contexte Spring
@AutoConfigureMockMvc   // permet de configurer le MockMvc
@ExtendWith(SpringExtension.class)      // permet d'utiliser les extensions Spring (annotations @BeforeEach, @AfterEach, etc.)
@TestInstance(TestInstance.Lifecycle.PER_CLASS) // permet de créer une seule instance de la classe de test
public class AuthenticationControllerTest {

        @Autowired      
        MockMvc mockMvc;        // permet de simuler des requêtes HTTP

        // Test qui vérifie si l'utilisateur admin peut se connecter
        @Test
        public void itShldLoginAdmin() throws Exception {
                // crée un utilisateur admin
                String email = "yoga@studio.com";
                String password = "test!1234";
                String requestBody = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";

                mockMvc.perform(post("/api/auth/login")         // simule une requête POST sur l'URL /api/auth/login
                                .contentType(MediaType.APPLICATION_JSON)    // indique que le contenu de la requête est du JSON
                                .content(requestBody))  // utilise l'utilisateur admin pour se connecter
                                .andExpect(status().isOk());    // vérifie que le code de statut de la réponse est 200
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
                                .andExpect(status().isUnauthorized());  // vérifie que le code de statut de la réponse est 401 (unauthorized)
        }

        // Test qui vérifie qu'un nouvelle utilisateur non admin peut s'enregistrer
        @Test
        public void itShldRegisterNewUser() throws Exception {
                String requestBody = createNonAdminUser();

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isOk())     // vérifie que le code de statut de la réponse est 200 (OK)
                                .andExpect(jsonPath("message", is("User registered successfully!")));   // vérifie que le bon message est retourné
        }

        private String createNonAdminUser() {
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
                return requestBody;
        }

        // Test qui vérifie qu'un utilisateur déjà présent dans la base de données ne
        // peut pas s'enregistrer
        @Test
        public void itShldNotRegisterExistingUser() throws Exception {
                String requestBody = createNonAdminUser();

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody))
                                .andExpect(status().isBadRequest());    // vérifie que le code de statut de la réponse est 400 (bad request)
        }

        @AfterAll
        public void cleanup() throws Exception {
                // delete the user created in the register method
                String request = createNonAdminUser();

                // login the user
                MvcResult result = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request))
                                .andReturn();   // get the response

                // get the token and the id of the user
                String content = result.getResponse().getContentAsString();
                String token = JsonPath.read(content, "$.token");
                int id = JsonPath.read(content, "$.id"); 

                // delete this user
                mockMvc.perform(delete("/api/user/" + id).header("Authorization", "Bearer " + token))
                                .andExpect(status().isOk());
        }

}
