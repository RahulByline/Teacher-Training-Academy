import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';

const TeacherCompetencyMapPage: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<{ [planId: number]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompetencyPlans() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getCompetencyPlans();
        setPlans(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch competency plans');
      } finally {
        setLoading(false);
      }
    }
    fetchCompetencyPlans();
  }, []);

  useEffect(() => {
    async function fetchAllCompetencies() {
      if (plans.length === 0) return;
      const all: { [planId: number]: any[] } = {};
      await Promise.all(
        plans.map(async (plan: any) => {
          const comps = await apiService.getPlanCompetencies(plan.id);
          all[plan.id] = comps;
        })
      );
      setCompetencies(all);
    }
    fetchAllCompetencies();
  }, [plans]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen bg-[#f9fafb] p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Competency Map</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : plans.length === 0 ? (
        <div className="text-gray-500">No competency plans found.</div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Competency Plans</h2>
          <ul className="space-y-8">
            {plans.map((plan) => (
              <li key={plan.id} className="flex flex-col gap-2 border-b pb-6 last:border-0">
                <span className="font-medium text-gray-800">{plan.name}</span>
                <span className="text-xs text-gray-500 mb-2">Status: {plan.status || 'N/A'}</span>
                {/* Competencies for this plan */}
                {competencies[plan.id] && competencies[plan.id].length > 0 ? (
                  <ul className="space-y-2 ml-4">
                    {competencies[plan.id].map((comp: any) => (
                      <li key={comp.competency.id} className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-700">{comp.competency.shortname || comp.competency.id}</span>
                        <span className="text-xs text-gray-500">{comp.competency.description || 'No description'}</span>
                        <span className="text-xs text-blue-600">Proficiency: {comp.proficiency !== undefined ? (comp.proficiency ? 'Achieved' : 'Not achieved') : 'N/A'}</span>
                        <span className="text-xs text-gray-400">Status: {comp.status || 'N/A'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-xs text-gray-400 ml-4">No competencies found for this plan.</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeacherCompetencyMapPage; 