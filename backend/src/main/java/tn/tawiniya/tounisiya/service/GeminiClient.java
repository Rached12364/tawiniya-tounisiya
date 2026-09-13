package tn.tawiniya.tounisiya.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tn.tawiniya.tounisiya.exception.AiServiceException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import java.util.List;
import java.util.Map;
@Service
public class GeminiClient {
    private final RestClient restClient;
    private final JsonMapper objectMapper = JsonMapper.builder().build();
    @Value("${app.ai.gemini.api-key}")
    private String apiKey;
    @Value("${app.ai.gemini.model}")
    private String model;
    public GeminiClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
                .build();
    }
    public String generateText(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiServiceException("Cle API IA non configuree (GEMINI_API_KEY manquante).");
        }
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );
        try {
            String rawResponse = restClient.post()
                    .uri("/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .header("content-type", "application/json")
                    .body(body)
                    .retrieve()
                    .body(String.class);
            JsonNode root = objectMapper.readTree(rawResponse);
            return root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asString();
        } catch (AiServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new AiServiceException("Erreur lors de l'appel au service IA.", e);
        }
    }
}