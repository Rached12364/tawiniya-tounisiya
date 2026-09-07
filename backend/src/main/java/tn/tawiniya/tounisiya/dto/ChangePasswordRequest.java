package tn.tawiniya.tounisiya.dto;
import lombok.Data;
@Data
public class ChangePasswordRequest {
    private String currentPassword;
    private String newPassword;
}