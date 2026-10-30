package com.skillswap.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityRulesTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void publicHealthEndpoint_AllowsAnonymousAccess() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk());
    }

    @Test
    void protectedEndpoint_RejectsAnonymousAccess() throws Exception {
        mockMvc.perform(get("/api/users/profile/" + UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }
}
