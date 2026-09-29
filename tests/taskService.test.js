const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

describe('taskService', () => {
  describe('create()', () => {
    test('should create a task with default values', () => {
      const task = taskService.create({
        title: 'Test task',
      });

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test task');
      expect(task.description).toBe('');
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('medium');
      expect(task.dueDate).toBeNull();
      expect(task.completedAt).toBeNull();
      expect(task.createdAt).toBeDefined();
    });

    test('should create a task with provided values', () => {
      const task = taskService.create({
        title: 'Important task',
        description: 'Test description',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-10-01',
      });

      expect(task.title).toBe('Important task');
      expect(task.description).toBe('Test description');
      expect(task.status).toBe('in_progress');
      expect(task.priority).toBe('high');
      expect(task.dueDate).toBe('2026-10-01');
    });
  });

  describe('getAll()', () => {
    test('should return all tasks', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });

      const tasks = taskService.getAll();

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].title).toBe('Task 2');
    });

    test('should return an empty array when there are no tasks', () => {
      const tasks = taskService.getAll();

      expect(tasks).toEqual([]);
    });
  });

  describe('findById()', () => {
    test('should find a task by id', () => {
      const createdTask = taskService.create({
        title: 'Find me',
      });

      const task = taskService.findById(createdTask.id);

      expect(task).toBeDefined();
      expect(task.title).toBe('Find me');
    });

    test('should return undefined for an unknown id', () => {
      const task = taskService.findById('invalid-id');

      expect(task).toBeUndefined();
    });
  });

  describe('getByStatus()', () => {
    test('should return tasks with the requested status', () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'Done task',
        status: 'done',
      });

      const tasks = taskService.getByStatus('todo');

      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Todo task');
    });
  });

  describe('getPaginated()', () => {
    test('should return tasks for the requested page', () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });
      taskService.create({ title: 'Task 3' });

      const tasks = taskService.getPaginated(1, 2);

      expect(tasks).toHaveLength(2);
      expect(tasks[0].title).toBe('Task 1');
      expect(tasks[1].title).toBe('Task 2');
    });
  });

  describe('getStats()', () => {
    test('should return task counts by status', () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'Progress task',
        status: 'in_progress',
      });

      taskService.create({
        title: 'Done task',
        status: 'done',
      });

      const stats = taskService.getStats();

      expect(stats.todo).toBe(1);
      expect(stats.in_progress).toBe(1);
      expect(stats.done).toBe(1);
      expect(stats.overdue).toBe(0);
    });

    test('should count overdue unfinished tasks', () => {
      taskService.create({
        title: 'Overdue task',
        status: 'todo',
        dueDate: '2020-01-01',
      });

      const stats = taskService.getStats();

      expect(stats.overdue).toBe(1);
    });

    test('should not count completed overdue tasks as overdue', () => {
      taskService.create({
        title: 'Completed task',
        status: 'done',
        dueDate: '2020-01-01',
      });

      const stats = taskService.getStats();

      expect(stats.overdue).toBe(0);
    });
  });

  describe('update()', () => {
    test('should update an existing task', () => {
      const task = taskService.create({
        title: 'Original title',
        priority: 'low',
      });

      const updatedTask = taskService.update(task.id, {
        title: 'Updated title',
      });

      expect(updatedTask.title).toBe('Updated title');
      expect(updatedTask.priority).toBe('low');
    });

    test('should return null when updating an unknown task', () => {
      const result = taskService.update('invalid-id', {
        title: 'Updated',
      });

      expect(result).toBeNull();
    });
  });

  describe('remove()', () => {
    test('should remove an existing task', () => {
      const task = taskService.create({
        title: 'Delete me',
      });

      const result = taskService.remove(task.id);

      expect(result).toBe(true);
      expect(taskService.getAll()).toHaveLength(0);
    });

    test('should return false when removing an unknown task', () => {
      const result = taskService.remove('invalid-id');

      expect(result).toBe(false);
    });
  });

  describe('completeTask()', () => {
    test('should mark a task as done', () => {
      const task = taskService.create({
        title: 'Complete me',
      });

      const completedTask = taskService.completeTask(task.id);

      expect(completedTask.status).toBe('done');
      expect(completedTask.completedAt).toBeDefined();
    });

    test('should return null for an unknown task', () => {
      const result = taskService.completeTask('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('assignTask()', () => {
    test('should assign a task', () => {
      const task = taskService.create({
        title: 'Assign me',
      });

      const updatedTask = taskService.assignTask(task.id, 'Sagar');

      expect(updatedTask.assignee).toBe('Sagar');
    });

    test('should return null for an unknown task', () => {
      const result = taskService.assignTask('invalid-id', 'Sagar');

      expect(result).toBeNull();
    });
  });
});