
import { toast } from '@/hooks/use-toast';

// Custom error class for validation errors
export class AIValidationError extends Error {
  errors: Record<string, string>;
  
  constructor(errors: Record<string, string>) {
    super('Validation Error');
    this.name = 'AIValidationError';
    this.errors = errors;
  }
}

// Load and validate against schema
export const validateAgainstSchema = async (
  data: any, 
  schemaPath: string
): Promise<Record<string, string> | null> => {
  try {
    // In a real implementation, this would dynamically load the schema
    // For now, we'll implement a basic validation mechanism
    
    if (schemaPath.includes('shipmentsField.json')) {
      return validateShipment(data);
    }
    
    // Default case - no validation errors
    return null;
  } catch (error) {
    console.error('Schema validation error:', error);
    toast({
      title: 'Schema Error',
      description: 'Failed to validate against schema',
      variant: 'destructive',
    });
    return { general: 'Schema validation failed' };
  }
};

// Shipment validation implementation
export const validateShipment = (data: any): Record<string, string> | null => {
  const errors: Record<string, string> = {};
  
  // Required fields validation
  const requiredFields = [
    'request_reference', 
    'origin_country', 
    'destination_country', 
    'weight_kg', 
    'delivery_status'
  ];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors[field] = `${field} is required`;
    }
  });
  
  // Type validation
  if (data.weight_kg && isNaN(parseFloat(data.weight_kg))) {
    errors.weight_kg = 'Weight must be a number';
  }
  
  if (data.volume_cbm && isNaN(parseFloat(data.volume_cbm))) {
    errors.volume_cbm = 'Volume must be a number';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Generic function to validate form data before submission
export const validateFormData = async (
  formData: any, 
  schemaPath: string
): Promise<void> => {
  const errors = await validateAgainstSchema(formData, schemaPath);
  
  if (errors) {
    throw new AIValidationError(errors);
  }
};
