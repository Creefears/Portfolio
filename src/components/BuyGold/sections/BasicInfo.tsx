import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import { FormData, FormErrors } from '../types';

interface BasicInfoProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicInfo({ formData, errors, onChange }: BasicInfoProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        <Briefcase className="w-6 h-6" />
        <h2>Informations de Base</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="title"
          label="Titre"
          value={formData.title}
          onChange={onChange}
          error={errors.title}
          required
        />
        <Input
          name="title_en"
          label="Title (EN)"
          value={formData.title_en || ''}
          onChange={onChange}
        />
        <Input
          name="year"
          label="Année"
          value={formData.year}
          onChange={onChange}
          error={errors.year}
          required
          icon={<Calendar className="w-5 h-5" />}
        />
      </div>

      <Input
        name="shortdescription"
        label="Description Courte"
        value={formData.shortdescription}
        onChange={onChange}
        error={errors.shortdescription}
        required
      />
      <Input
        name="shortdescription_en"
        label="Short description (EN)"
        value={formData.shortdescription_en || ''}
        onChange={onChange}
      />

      <TextArea
        name="fulldescription"
        label="Description Complète"
        value={formData.fulldescription}
        onChange={onChange}
        error={errors.fulldescription}
        required
      />
      <TextArea
        name="fulldescription_en"
        label="Full description (EN)"
        value={formData.fulldescription_en || ''}
        onChange={onChange}
      />
    </div>
  );
}