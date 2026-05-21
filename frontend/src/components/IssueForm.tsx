import React, { useState, useEffect } from 'react';
import { useIssueStore } from '../store/issueStore';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import { IssuePriority, IssueSeverity } from '../types';
import type { Issue } from '../types';
import toast from 'react-hot-toast';

interface IssueFormProps {
  issue?: Issue | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Issue Form Component
 * Reusable form for creating and editing issues
 */
export const IssueForm: React.FC<IssueFormProps> = ({ issue, onClose, onSuccess }) => {
  const { createIssue, updateIssue, isLoading } = useIssueStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: IssuePriority.MEDIUM,
    severity: IssueSeverity.MODERATE
  });

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        severity: issue.severity
      });
    }
  }, [issue]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (issue) {
        await updateIssue(issue._id, formData);
        toast.success('Issue updated successfully');
      } else {
        await createIssue(formData);
        toast.success('Issue created successfully');
      }
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Operation failed';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        placeholder="Enter issue title"
        required
      />

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail"
          rows={5}
          required
          className={`
            bg-gray-50 border text-gray-900 text-sm rounded-lg
            focus:ring-primary-500 focus:border-primary-500
            block w-full p-2.5 transition-colors resize-none
            ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: IssuePriority.LOW, label: 'Low' },
            { value: IssuePriority.MEDIUM, label: 'Medium' },
            { value: IssuePriority.HIGH, label: 'High' },
            { value: IssuePriority.CRITICAL, label: 'Critical' }
          ]}
          required
        />

        <Select
          label="Severity"
          name="severity"
          value={formData.severity}
          onChange={handleChange}
          options={[
            { value: IssueSeverity.MINOR, label: 'Minor' },
            { value: IssueSeverity.MODERATE, label: 'Moderate' },
            { value: IssueSeverity.MAJOR, label: 'Major' },
            { value: IssueSeverity.BLOCKER, label: 'Blocker' }
          ]}
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          {issue ? 'Update Issue' : 'Create Issue'}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
