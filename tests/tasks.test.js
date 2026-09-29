const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

describe('Task API', () => {
  describe('GET /tasks', () => {
    test('should return an empty array when there are no tasks', async () => {
      const response = await request(app)
        .get('/tasks');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return all tasks', async () => {
      taskService.create({ title: 'Task 1' });
      taskService.create({ title: 'Task 2' });

      const response = await request(app)
        .get('/tasks');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test('should filter tasks by status', async () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'Done task',
        status: 'done',
      });

      const response = await request(app)
        .get('/tasks?status=todo');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('todo');
    });
  });

  describe('POST /tasks', () => {
    test('should create a task', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'New task',
          description: 'Test description',
          priority: 'high',
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe('New task');
      expect(response.body.description).toBe('Test description');
      expect(response.body.priority).toBe('high');
      expect(response.body.status).toBe('todo');
      expect(response.body.id).toBeDefined();
    });

    test('should reject a task without a title', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          description: 'No title',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should reject an invalid priority', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Test task',
          priority: 'urgent',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should reject an invalid due date', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({
          title: 'Test task',
          dueDate: 'not-a-date',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /tasks/:id', () => {
    test('should update an existing task', async () => {
      const task = taskService.create({
        title: 'Original title',
      });

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({
          title: 'Updated title',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.title).toBe('Updated title');
    });

    test('should return 404 for an unknown task', async () => {
      const response = await request(app)
        .put('/tasks/unknown-id')
        .send({
          title: 'Updated title',
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('should reject an empty title', async () => {
      const task = taskService.create({
        title: 'Original title',
      });

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .send({
          title: '',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE /tasks/:id', () => {
    test('should delete an existing task', async () => {
      const task = taskService.create({
        title: 'Delete me',
      });

      const response = await request(app)
        .delete(`/tasks/${task.id}`);

      expect(response.statusCode).toBe(204);

      const tasks = taskService.getAll();
      expect(tasks).toHaveLength(0);
    });

    test('should return 404 for an unknown task', async () => {
      const response = await request(app)
        .delete('/tasks/unknown-id');

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    test('should complete an existing task', async () => {
      const task = taskService.create({
        title: 'Complete me',
        priority: 'high',
      });

      const response = await request(app)
        .patch(`/tasks/${task.id}/complete`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('done');
      expect(response.body.completedAt).toBeDefined();
    });

    test('should return 404 for an unknown task', async () => {
      const response = await request(app)
        .patch('/tasks/unknown-id/complete');

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('GET /tasks/stats', () => {
    test('should return task statistics', async () => {
      taskService.create({
        title: 'Todo task',
        status: 'todo',
      });

      taskService.create({
        title: 'Done task',
        status: 'done',
      });

      const response = await request(app)
        .get('/tasks/stats');

      expect(response.statusCode).toBe(200);
      expect(response.body.todo).toBe(1);
      expect(response.body.done).toBe(1);
      expect(response.body.in_progress).toBe(0);
      expect(response.body.overdue).toBe(0);
    });
  });

  describe('PATCH /tasks/:id/assign', () => {
    test('should assign a task', async () => {
      const task = taskService.create({ title: 'Assign me' });

      const response = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: 'Sagar' });

      expect(response.statusCode).toBe(200);
      expect(response.body.assignee).toBe('Sagar');
    });

    test('should return 404 for an unknown task', async () => {
      const response = await request(app)
        .patch('/tasks/unknown-id/assign')
        .send({ assignee: 'Sagar' });

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });

    test('should reject an empty assignee', async () => {
      const task = taskService.create({ title: 'Assign me' });

      const response = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: '' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});