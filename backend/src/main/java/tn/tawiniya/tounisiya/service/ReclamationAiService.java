package tn.tawiniya.tounisiya.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tn.tawiniya.tounisiya.dto.ReclamationAnalysisResponse;
import tn.tawiniya.tounisiya.entity.ReclamationType;
import tn.tawiniya.tounisiya.exception.AiServiceException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import java.util.List;
import java.util.Map;
@Service
public class ReclamationAiService {
    private final RestClient restClient;
    private final JsonMapper objectMapper = JsonMapper.builder().build();
    @Value("${app.ai.gemini.api-key}")
    private String apiKey;
    @Value("${app.ai.gemini.model}")
    private String model;
    public ReclamationAiService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models")
                .build();
    }
    public ReclamationAnalysisResponse analyze(String description) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiServiceException("Cle API IA non configuree (GEMINI_API_KEY manquante).");
        }
        String prompt = """
                Tu analyses une reclamation soumise par un utilisateur sur une plateforme tunisienne.
                Reponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou apres, au format exact :
                {"suggestedType": "ADMINISTRATIVE" ou "JURIDIQUE", "suggestedSubject": "titre court et clair en francais, max 150 caracteres", "summary": "resume neutre en 1 a 2 phrases en francais"}
                Description de la reclamation :
                """ + description;
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );
        try {
            String rawResponse = restClient.post()
                    .uri("/{model}:generateContent?key={key}", model, apiKey)
                    .header("content-type", "application/json")
                    .body(body)
                    .retrieve()
                    .body(String.class);
            JsonNode root = objectMapper.readTree(rawResponse);
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asString();
            String jsonText = text.trim();
            int start = jsonText.indexOf('{');
            int end = jsonText.lastIndexOf('}');
            if (start == -1 || end == -1) {
                throw new AiServiceException("Reponse IA invalide (pas de JSON detecte).");
            }
            jsonText = jsonText.substring(start, end + 1);
            JsonNode parsed = objectMapper.readTree(jsonText);
            ReclamationType type = ReclamationType.valueOf(parsed.path("suggestedType").asString("JURIDIQUE"));
            String subject = parsed.path("suggestedSubject").asString("");
            String summary = parsed.path("summary").asString("");
            if (subject.length() > 150) {
                subject = subject.substring(0, 150);
            }
            return ReclamationAnalysisResponse.builder()
                    .suggestedType(type)
                    .suggestedSubject(subject)
                    .summary(summary)
                    .build();
        } catch (AiServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new AiServiceException("Erreur lors de l'appel au service IA.", e);
        }
    }
}