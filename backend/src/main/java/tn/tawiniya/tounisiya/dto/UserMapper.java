package tn.tawiniya.tounisiya.dto;

import org.mapstruct.Mapper;
import tn.tawiniya.tounisiya.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
