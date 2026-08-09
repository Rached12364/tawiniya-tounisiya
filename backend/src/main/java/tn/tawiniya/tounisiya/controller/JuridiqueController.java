package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.tawiniya.tounisiya.dto.LegalSectionResponse;
import tn.tawiniya.tounisiya.service.LegalSectionService;
import java.util.List;
@RestController
@RequestMapping("/api/juridique")
@RequiredArgsConstructor
public class JuridiqueController {
    private final LegalSectionService legalSectionService;
    @GetMapping
    public List<LegalSectionResponse> getActive() {
        return legalSectionService.getActive();
    }
}