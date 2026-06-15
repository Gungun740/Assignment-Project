package com.api.auth.dto;

import com.api.auth.entity.Task.TaskPriority;
import com.api.auth.entity.Task.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 255, message = "Title must be 1–255 characters")
    private String title;

    @Size(max = 1000, message = "Description must be under 1000 characters")
    private String description;

    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
}
