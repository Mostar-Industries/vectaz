
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from 'lucide-react';

interface ProjectInfoSectionProps {
  defaultValues: {
    description: string;
    goals: string;
    background: string;
  };
}

const ProjectInfoSection: React.FC<ProjectInfoSectionProps> = ({
  defaultValues
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-[#00FFD1] mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2" />
        PROJECT INFORMATION
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">PROJECT DESCRIPTION</Label>
          <p className="text-xs text-gray-400 italic mb-1">
            Please provide as much information as possible for the vendor's review.
          </p>
          <Textarea 
            id="description" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            rows={3}
            defaultValue={defaultValues.description}
          />
        </div>
        <div>
          <Label htmlFor="goals">PROJECT GOALS AND OBJECTIVES</Label>
          <Textarea 
            id="goals" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            rows={3}
            defaultValue={defaultValues.goals}
          />
        </div>
        <div>
          <Label htmlFor="background">PROJECT BACKGROUND</Label>
          <Textarea 
            id="background" 
            className="border-[#00FFD1]/20 focus-visible:ring-[#00FFD1]/30 bg-background/50"
            rows={3}
            defaultValue={defaultValues.background}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoSection;
