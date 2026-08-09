package tn.tawiniya.tounisiya.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "legal_sections")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    @Column(name = "order_index", nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;
    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
