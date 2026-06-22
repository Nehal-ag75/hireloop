/**
 * Builds a dependency graph from topics and runs topological sort
 * (Kahn's Algorithm - BFS based) to determine correct learning order.
 *
 * @param {string[]} topics - list of unique topic names
 * @param {Object} prerequisiteMap - { topic: prerequisiteTopic or null }
 * @returns {string[]} topics in valid prerequisite-respecting order
 */
function topologicalSort(topics, prerequisiteMap) {
  const inDegree = {};
  const adjList = {};

  // Initialize graph nodes
  topics.forEach((topic) => {
    inDegree[topic] = 0;
    adjList[topic] = [];
  });

  // Build edges: prerequisite -> topic
  topics.forEach((topic) => {
    const prereq = prerequisiteMap[topic];
    if (prereq && topics.includes(prereq)) {
      adjList[prereq].push(topic);
      inDegree[topic]++;
    }
  });

  // Start with all topics that have no prerequisites
  const queue = topics.filter((topic) => inDegree[topic] === 0);
  const sortedOrder = [];

  while (queue.length > 0) {
    const current = queue.shift();
    sortedOrder.push(current);

    adjList[current].forEach((neighbor) => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }

  // If we couldn't sort everything, there's a cycle (shouldn't happen with our data)
  if (sortedOrder.length !== topics.length) {
    console.warn('Cycle detected in topic dependencies, returning partial order');
  }

  return sortedOrder;
}

module.exports = topologicalSort;