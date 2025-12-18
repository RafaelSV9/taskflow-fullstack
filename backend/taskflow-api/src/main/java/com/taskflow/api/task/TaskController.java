package com.taskflow.api.task;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Task> list() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task create(@RequestBody CreateTaskRequest body) {
        if (body == null || body.title() == null || body.title().trim().isEmpty()) {
            throw new IllegalArgumentException("title is required");
        }
        return repository.save(new Task(body.title().trim()));
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody UpdateTaskRequest body) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        if (body != null) {
            if (body.title() != null) task.setTitle(body.title().trim());
            if (body.completed() != null) task.setCompleted(body.completed());
        }

        return repository.save(task);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
