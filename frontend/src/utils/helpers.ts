import { IssuePriority, IssueStatus, IssueSeverity } from '../types';

/**
 * Utility helper functions
 */

/**
 * Get priority color classes
 */
export const getPriorityColor = (priority: IssuePriority): string => {
  switch (priority) {
    case IssuePriority.LOW:
      return 'bg-gray-100 text-gray-700 border-gray-300';
    case IssuePriority.MEDIUM:
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case IssuePriority.HIGH:
      return 'bg-orange-100 text-orange-700 border-orange-300';
    case IssuePriority.CRITICAL:
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

/**
 * Get status color classes
 */
export const getStatusColor = (status: IssueStatus): string => {
  switch (status) {
    case IssueStatus.OPEN:
      return 'bg-green-100 text-green-700 border-green-300';
    case IssueStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case IssueStatus.RESOLVED:
      return 'bg-purple-100 text-purple-700 border-purple-300';
    case IssueStatus.CLOSED:
      return 'bg-gray-100 text-gray-700 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

/**
 * Get severity color classes
 */
export const getSeverityColor = (severity: IssueSeverity): string => {
  switch (severity) {
    case IssueSeverity.MINOR:
      return 'bg-green-100 text-green-700 border-green-300';
    case IssueSeverity.MODERATE:
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case IssueSeverity.MAJOR:
      return 'bg-orange-100 text-orange-700 border-orange-300';
    case IssueSeverity.BLOCKER:
      return 'bg-red-100 text-red-700 border-red-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

/**
 * Format status for display
 */
export const formatStatus = (status: IssueStatus): string => {
  return status.replace('_', ' ').toUpperCase();
};

/**
 * Format priority for display
 */
export const formatPriority = (priority: IssuePriority): string => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

/**
 * Format severity for display
 */
export const formatSeverity = (severity: IssueSeverity): string => {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
