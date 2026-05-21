import React, { useEffect, useState } from 'react';
import { useIssueStore } from '../store/issueStore';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import {
  Plus,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit,
  CheckCircle,
  X,
  AlertCircle,
  Clock,
  CheckCheck,
  BarChart3
} from 'lucide-react';
import { IssueStatus, IssuePriority, IssueSeverity } from '../types';
import type { Issue } from '../types';
import {
  getPriorityColor,
  getStatusColor,
  getSeverityColor,
  formatStatus,
  formatPriority,
  formatSeverity,
  debounce
} from '../utils/helpers';
import { IssueForm } from '../components/IssueForm';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

/**
 * Dashboard Page Component
 * Main page showing issues, stats, and filters
 */
export const Dashboard: React.FC = () => {
  const {
    issues,
    stats,
    filters,
    pagination,
    isLoading,
    fetchIssues,
    fetchStats,
    setFilters,
    resetFilters,
    deleteIssue,
    updateIssueStatus,
    exportToJSON,
    exportToCSV
  } = useIssueStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchIssues(currentPage);
    fetchStats();
  }, [currentPage]);

  // Debounced search
  const handleSearchChange = debounce((value: string) => {
    setFilters({ search: value });
    setCurrentPage(1);
    fetchIssues(1);
  }, 500);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ [key]: value });
    setCurrentPage(1);
    fetchIssues(1);
  };

  const handleResetFilters = () => {
    resetFilters();
    setCurrentPage(1);
    fetchIssues(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIssue(id);
      toast.success('Issue deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete issue');
    }
  };

  const handleStatusUpdate = async (id: string, status: IssueStatus) => {
    try {
      await updateIssueStatus(id, status);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      if (format === 'json') {
        await exportToJSON();
      } else {
        await exportToCSV();
      }
      toast.success(`Exported to ${format.toUpperCase()} successfully`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Issues
          </h1>
          <p className="text-gray-600">Manage and track all your issues</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Total Issues - Dark Slate */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 !shadow-lg hover:!shadow-xl hover:-translate-y-0.5 border-0 relative overflow-hidden group !p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-300">Total Issues</p>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <BarChart3 size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
            </Card>

            {/* Open Issues - Muted Amber */}
            <Card className="bg-gradient-to-br from-amber-600 to-amber-700 !shadow-lg hover:!shadow-xl hover:-translate-y-0.5 border-0 relative overflow-hidden group !p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-amber-100">Open</p>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <AlertCircle size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.byStatus.open}</p>
              </div>
            </Card>

            {/* In Progress - Muted Blue */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 !shadow-lg hover:!shadow-xl hover:-translate-y-0.5 border-0 relative overflow-hidden group !p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-blue-100">In Progress</p>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Clock size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.byStatus.in_progress}</p>
              </div>
            </Card>

            {/* Resolved - Muted Green */}
            <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 !shadow-lg hover:!shadow-xl hover:-translate-y-0.5 border-0 relative overflow-hidden group !p-5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-emerald-100">Resolved</p>
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <CheckCheck size={16} className="text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats.byStatus.resolved}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search issues..."
                className="!pl-11 !py-2.5"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="!px-4 !h-10">
              <Filter size={18} />
            </Button>
            <div className="relative group">
              <Button variant="ghost" size="sm" className="!px-4 !h-10">
                <Download size={18} />
              </Button>
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 hidden group-hover:block z-10 overflow-hidden">
                <button
                  onClick={() => handleExport('json')}
                  className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)} className="!bg-black hover:!bg-zinc-800 !px-5 !h-10">
              <Plus size={18} className="mr-2" />
              New Issue
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6 !p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Select
                label="Status"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: IssueStatus.OPEN, label: 'Open' },
                  { value: IssueStatus.IN_PROGRESS, label: 'In Progress' },
                  { value: IssueStatus.RESOLVED, label: 'Resolved' },
                  { value: IssueStatus.CLOSED, label: 'Closed' }
                ]}
              />
              <Select
                label="Priority"
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                options={[
                  { value: '', label: 'All Priorities' },
                  { value: IssuePriority.LOW, label: 'Low' },
                  { value: IssuePriority.MEDIUM, label: 'Medium' },
                  { value: IssuePriority.HIGH, label: 'High' },
                  { value: IssuePriority.CRITICAL, label: 'Critical' }
                ]}
              />
              <Select
                label="Severity"
                value={filters.severity || ''}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                options={[
                  { value: '', label: 'All Severities' },
                  { value: IssueSeverity.MINOR, label: 'Minor' },
                  { value: IssueSeverity.MODERATE, label: 'Moderate' },
                  { value: IssueSeverity.MAJOR, label: 'Major' },
                  { value: IssueSeverity.BLOCKER, label: 'Blocker' }
                ]}
              />
            </div>
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Issues List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-500">Loading issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <Card>
              <div className="text-center py-16">
                <p className="text-gray-900 text-lg font-medium">No issues found</p>
                <p className="text-gray-500 mt-2">Create your first issue to get started</p>
              </div>
            </Card>
          ) : (
            issues.map((issue) => (
              <Card key={issue._id} hoverable className="!p-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-base font-semibold text-gray-900 truncate">{issue.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{issue.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge color={getStatusColor(issue.status)}>{formatStatus(issue.status)}</Badge>
                      <Badge color={getPriorityColor(issue.priority)}>{formatPriority(issue.priority)}</Badge>
                      <Badge color={getSeverityColor(issue.severity)}>{formatSeverity(issue.severity)}</Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(issue.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {issue.status !== IssueStatus.RESOLVED && issue.status !== IssueStatus.CLOSED && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate(issue._id, IssueStatus.RESOLVED)}
                        title="Mark as Resolved"
                      >
                        <CheckCircle size={18} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedIssue(issue);
                        setIsEditModalOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </Button>
                    {deleteConfirm === issue._id ? (
                      <div className="flex gap-1">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(issue._id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(issue._id)}
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
              {pagination.totalItems} issues
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={!pagination.hasPrevPage}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft size={18} />
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Issue"
      >
        <IssueForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchIssues(currentPage);
          }}
        />
      </Modal>

      {/* Edit Issue Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedIssue(null);
        }}
        title="Edit Issue"
      >
        <IssueForm
          issue={selectedIssue}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedIssue(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedIssue(null);
            fetchIssues(currentPage);
          }}
        />
      </Modal>
    </div>
  );
};
