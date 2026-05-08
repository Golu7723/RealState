package com.intela.realestatebackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
@SpringBootTest
public class BaseTestContainerTest {

    @Autowired
    protected MockMvc mockMvc;
    @Autowired
    protected ObjectMapper objectMapper;

    @BeforeAll
    public static void setUp() {
        // Use localhost MySQL for tests
        System.setProperty("spring.datasource.url", "jdbc:mysql://127.0.0.1:3306/RealStateproject?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
        System.setProperty("spring.datasource.username", "root");
        System.setProperty("spring.datasource.password", "root");
    }

    @Test
    void test() {
        System.out.println("Tests loaded");
    }
}
