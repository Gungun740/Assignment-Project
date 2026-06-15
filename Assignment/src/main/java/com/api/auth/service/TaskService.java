package com.api.auth.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.auth.dto.PageResponse;
import com.api.auth.dto.TaskRequest;
import com.api.auth.dto.TaskResponse;
import com.api.auth.entity.Task;
import com.api.auth.entity.Task.TaskPriority;
import com.api.auth.entity.Task.TaskStatus;
import com.api.auth.entity.User;
import com.api.auth.exception.AppException;
import com.api.auth.repository.TaskRepository;
import com.api.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User user = getCurrentUser();
        Task task = Task.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .user(user)
                .build();
        task = taskRepository.save(task);
        log.info("Task created: {} by user: {}", task.getId(), user.getUsername());
        return toResponse(task);
    }

    public PageResponse<TaskResponse> getMyTasks(int page, int size, String sortBy,
                                                  String direction, TaskStatus status) {
        User user = getCurrentUser();
        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Task> tasks;
        if (status != null) {
            tasks = taskRepository.findByUserAndStatus(user, status, pageable);
        } else {
            tasks = taskRepository.findByUser(user, pageable);
        }

        return PageResponse.from(tasks.map(this::toResponse));
    }

    public PageResponse<TaskResponse> searchMyTasks(String keyword, int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Task> tasks = taskRepository.searchByUserAndKeyword(user, keyword, pageable);
        return PageResponse.from(tasks.map(this::toResponse));
    }

    public TaskResponse getTask(Long id) {
        User user = getCurrentUser();
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> AppException.notFound("Task not found with id: " + id));
            return toResponse(task);
        }

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> AppException.notFound("Task not found with id: " + id));
        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> AppException.notFound("Task not found with id: " + id));

        task.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription().trim());
        }
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

        task = taskRepository.save(task);
        return toResponse(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        User user = getCurrentUser();
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> AppException.notFound("Task not found"));
            taskRepository.delete(task);
        } else {
            Task task = taskRepository.findByIdAndUser(id, user)
                    .orElseThrow(() -> AppException.notFound("Task not found with id: " + id));
            taskRepository.delete(task);
        }
        log.info("Task deleted: {} by user: {}", id, user.getUsername());
    }

    // Admin only
    public PageResponse<TaskResponse> getAllTasks(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("DESC")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Task> tasks = taskRepository.findAll(pageable);
        return PageResponse.from(tasks.map(this::toResponse));
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> AppException.notFound("User not found: " + username));
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .userId(task.getUser().getId())
                .username(task.getUser().getUsername())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}