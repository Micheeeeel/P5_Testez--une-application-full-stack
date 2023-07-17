package com.openclassrooms.starterjwt;

import com.openclassrooms.starterjwt.controllers.AuthController;
import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.security.WebSecurityConfig;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import com.openclassrooms.starterjwt.security.jwt.AuthTokenFilter;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class SpringBootSecurityJwtApplicationTests {

    @Autowired
    private AuthController authController;

    @Autowired
    private SessionController sessionController;

    @Autowired
    private TeacherController teacherController;

    @Autowired
    private UserController userController;


    @Autowired
    private AuthEntryPointJwt authEntryPointJwt;

    @Autowired
    private AuthTokenFilter authTokenFilter;

    @Autowired
    private JwtUtils jwtUtils;


    @Autowired
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    private WebSecurityConfig webSecurityConfig;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private UserService userService;


    @Test
    public void contextLoads() {
        assertThat(authController).isNotNull();
        assertThat(sessionController).isNotNull();
        assertThat(teacherController).isNotNull();
        assertThat(userController).isNotNull();
        assertThat(authEntryPointJwt).isNotNull();
        assertThat(authTokenFilter).isNotNull();
        assertThat(jwtUtils).isNotNull();
        assertThat(userDetailsServiceImpl).isNotNull();
        assertThat(webSecurityConfig).isNotNull();
        assertThat(sessionService).isNotNull();
        assertThat(teacherService).isNotNull();
        assertThat(userService).isNotNull();
    }

}
