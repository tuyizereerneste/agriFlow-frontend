import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Plus, Trash } from 'lucide-react';

interface CreateProjectFormProps {
  onSuccess: () => void;
}

interface Company {
  id: string;
  user: {
    id: string;
    name: string;
  };
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    userId: '',
    startDate: '',
    endDate: '',
    objectives: '',
    targetPractices: [] as Array<{
      title: string;
      initialSituation: string;
      activities: Array<{
        title: string;
        description: string;
        startDate: string;
        endDate: string;
      }>;
    }>,
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPractices, setShowPractices] = useState(false);

  useEffect(() => {
    fetchRegisteredCompanies();
  }, []);

  const fetchRegisteredCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ data: Company[] }>(`https://agriflow-backend-cw6m.onrender.com/company/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.data)) {
        setCompanies(response.data.data);
      } else {
        console.error('Unexpected data format:', response.data);
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching registered companies:', error);
      setCompanies([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, path: string) => {
    const value = e.target.value;
    const keys = path.split('.');

    setFormData((prev) => {
      const updated = { ...prev } as any;
      let ref = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(ref)) {
          ref = ref[Number(keys[i])];
        } else {
          ref = ref[keys[i]];
        }
      }

      ref[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addPractice = () => {
    setFormData((prev) => ({
      ...prev,
      targetPractices: [
        ...prev.targetPractices,
        {
          title: '',
          initialSituation: '',
          activities: [{ title: '', description: '', startDate: '', endDate: '' }],
        },
      ],
    }));
  };

  const removePractice = (index: number) => {
    const newPractices = [...formData.targetPractices];
    newPractices.splice(index, 1);
    setFormData({ ...formData, targetPractices: newPractices });
  };

  const addActivity = (practiceIndex: number) => {
    const practices = [...formData.targetPractices];
    practices[practiceIndex].activities.push({ title: '', description: '', startDate: '', endDate: '' });
    setFormData({ ...formData, targetPractices: practices });
  };

  const removeActivity = (practiceIndex: number, activityIndex: number) => {
    const practices = [...formData.targetPractices];
    practices[practiceIndex].activities.splice(activityIndex, 1);
    setFormData({ ...formData, targetPractices: practices });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.targetPractices.length === 0) newErrors.targetPractices = 'At least one practice is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');

      interface ProjectResponse {
        title: string;
      }

      const response = await axios.post<ProjectResponse>(
        `https://agriflow-backend-cw6m.onrender.com/project/create-project`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage({
        type: 'success',
        text: `Project "${response.data.title}" created successfully!`,
      });
      setFormData({
        title: '',
        description: '',
        userId: '',
        startDate: '',
        endDate: '',
        objectives: '',
        targetPractices: [],
      });

      // Call the onSuccess callback
      onSuccess();
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'An error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectDetailsSubmit = () => {
    if (formData.title && formData.description && formData.userId && formData.startDate && formData.endDate) {
      setShowPractices(true);
    } else {
      setErrors({
        title: !formData.title ? 'Title is required' : '',
        description: !formData.description ? 'Description is required' : '',
        userId: !formData.userId ? 'User ID is required' : '',
        startDate: !formData.startDate ? 'Start date is required' : '',
        endDate: !formData.endDate ? 'End date is required' : '',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold">Create New Project</h2>
      <p className="text-gray-600">Fill in the details below to create a new project.</p>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto mt-6">
        {message && (
          <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <Input label="Project Title" name="title" value={formData.title} onChange={(e) => handleChange(e, 'title')} error={errors.title} required />
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
            Project Owner
          </label>
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={(e) => handleChange(e, 'userId')}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.user.id}>
                {company.user.name}
              </option>
            ))}
          </select>
          {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId}</p>}
        </div>
        <Input label="Description" name="description" value={formData.description} onChange={(e) => handleChange(e, 'description')} error={errors.description} required />
        <Input label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={(e) => handleChange(e, 'startDate')} error={errors.startDate} required />
        <Input label="End Date" type="date" name="endDate" value={formData.endDate} onChange={(e) => handleChange(e, 'endDate')} error={errors.endDate} required />
        <Input label="Objectives" name="objectives" value={formData.objectives} onChange={(e) => handleChange(e, 'objectives')} />

        <Button type="button" variant="outline" onClick={handleProjectDetailsSubmit} className="w-full">
          Next: Add Practices
        </Button>

        {showPractices && (
          <>
            {formData.targetPractices.map((practice, i) => (
              <div key={i} className="border p-4 rounded-md space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">Practice {i + 1}</h4>
                  {formData.targetPractices.length > 1 && (
                    <button type="button" onClick={() => removePractice(i)} className="text-red-500">
                      Remove
                      <Trash size={16} />
                    </button>
                  )}
                </div>
                <Input label="Title" value={practice.title} onChange={(e) => handleChange(e, `targetPractices.${i}.title`)} required />
                <Input label="Initial Situation" value={practice.initialSituation} onChange={(e) => handleChange(e, `targetPractices.${i}.initialSituation`)} />

                {practice.activities.map((activity, j) => (
                  <div key={j} className="border border-gray-200 rounded-md p-3 bg-white space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Activity {j + 1}</span>
                      {practice.activities.length > 1 && (
                        <button type="button" onClick={() => removeActivity(i, j)} className="text-red-400">
                          Remove
                          <Trash size={14} />
                        </button>
                      )}
                    </div>
                    <Input label="Activity Title" value={activity.title} onChange={(e) => handleChange(e, `targetPractices.${i}.activities.${j}.title`)} required />
                    <Input label="Description" value={activity.description} onChange={(e) => handleChange(e, `targetPractices.${i}.activities.${j}.description`)} />
                    <Input type="date" label="Start Date" value={activity.startDate} onChange={(e) => handleChange(e, `targetPractices.${i}.activities.${j}.startDate`)} required />
                    <Input type="date" label="End Date" value={activity.endDate} onChange={(e) => handleChange(e, `targetPractices.${i}.activities.${j}.endDate`)} required />
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={() => addActivity(i)} className="w-full">
                  <Plus size={16} className="mr-2" /> Add Activity
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addPractice} className="w-full">
              <Plus size={16} className="mr-2" /> Add Practice
            </Button>
          </>
        )}

        {showPractices && (
          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
            Create Project
          </Button>
        )}
      </form>
    </div>
  );
};

export default CreateProjectForm;