module.exports = function scheduleTasksWithPriority(tasks) {
  const now = new Date();
  const priorityScoreMap = { high: 3, normal: 2, low: 1 };

  const graph = new Map(); 
  const inDegree = new Map(); 
  const taskMap = new Map();
  const dependentsMap = new Map(); 

  const activeTasks = tasks.filter(task => task.status !== 'COMPLETED');

  for (const task of activeTasks) {
    const id = task._id.toString();
    taskMap.set(id, task);
    graph.set(id, []);
    inDegree.set(id, 0);
    dependentsMap.set(id, 0);
  }

  for (const task of activeTasks) {
    const curId = task._id.toString();
    for (const dep of task.dependencies || []) {
      const depId = dep.toString();
      if (!graph.has(depId)) continue;
      graph.get(depId).push(curId);
      inDegree.set(curId, inDegree.get(curId) + 1);
      dependentsMap.set(depId, dependentsMap.get(depId) + 1);
    }
  }

  const calculateWeight = (task, dependentsCount) => {
    const priorityScore = priorityScoreMap[task.priority] || 0;
    const daysUntilDue = Math.ceil((new Date(task.dueDate) - now) / (1000 * 60 * 60 * 24));
    const dueScore = daysUntilDue <= 0 ? 20 : Math.max(0, 10 - daysUntilDue); 
    const blockingScore = dependentsCount * 5;

    return priorityScore * 10 + dueScore + blockingScore;
  };

  let readyQueue = [];

  for (const [id, degree] of inDegree.entries()) {
    if (degree === 0) {
      const task = taskMap.get(id);
      const dependentsCount = dependentsMap.get(id) || 0;
      readyQueue.push({ id, weight: calculateWeight(task, dependentsCount) });
    }
  }

  const sortedTasks = [];

  while (readyQueue.length > 0) {
    readyQueue.sort((a, b) => b.weight - a.weight);
    const { id } = readyQueue.shift();
    const task = taskMap.get(id);
    sortedTasks.push(task);

    for (const neighbor of graph.get(id)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        const neighborTask = taskMap.get(neighbor);
        const dependentsCount = dependentsMap.get(neighbor) || 0;
        readyQueue.push({
          id: neighbor,
          weight: calculateWeight(neighborTask, dependentsCount),
        });
      }
    }
  }

  if (sortedTasks.length !== activeTasks.length) {
    throw new Error('Cycle detected in task dependencies');
  }

  return sortedTasks;
};
