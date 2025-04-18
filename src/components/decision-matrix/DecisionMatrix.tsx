
import React, { useState, useEffect } from 'react';
import { MatrixData } from '@/utils/decisionMatrixParser';
import { retrieveDecisionMatrix, storeDecisionMatrix, runMatrixCalculation } from '@/services/matrixService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import our new components
import MatrixTable from './MatrixTable';
import CalculationResults from './CalculationResults';

const DecisionMatrix: React.FC = () => {
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  // Load matrix data on component mount
  useEffect(() => {
    const loadMatrixData = async () => {
      setIsLoading(true);
      
      // Try to load from Supabase first
      const dbMatrix = await retrieveDecisionMatrix();
      
      if (dbMatrix && dbMatrix.rows.length > 0) {
        setMatrixData(dbMatrix);
      } else {
        // If not in database, load from alternative source
        const { loadDecisionMatrix } = await import('@/utils/decisionMatrixParser');
        const csvMatrix = await loadDecisionMatrix();
        if (csvMatrix) {
          const formattedMatrix: MatrixData = {
            rows: csvMatrix.matrix,
            columnCount: csvMatrix.criteria.length
          };
          setMatrixData(formattedMatrix);
          
          // Store in Supabase for future use
          if (formattedMatrix.rows.length > 0) {
            await storeDecisionMatrix(formattedMatrix);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    loadMatrixData();
    
    // Set up Supabase realtime subscription for calculation results
    const channel = supabase
      .channel('matrix_results')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'calculation_results' },
        (payload) => {
          toast({
            title: "New Result Available",
            description: "A new calculation result has been received",
          });
          setCalculationResult(payload.new);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Run a calculation on the decision matrix
  const runCalculation = async () => {
    if (!matrixData || matrixData.rows.length === 0) {
      toast({
        title: "Error",
        description: "No matrix data available to process",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await runMatrixCalculation(matrixData);
      setCalculationResult(result);
      toast({
        title: "Success",
        description: "Matrix calculation completed successfully",
      });
    } catch (error) {
      console.error("Error processing matrix:", error);
      toast({
        title: "Calculation Error",
        description: "Failed to process the matrix",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading decision matrix...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Decision Matrix</CardTitle>
        <CardDescription>
          Neutrosophic AHP-TOPSIS matrix data for decision engine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MatrixTable rows={matrixData?.rows || []} columnCount={matrixData?.columnCount || 0} />
        <CalculationResults calculationResult={calculationResult} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            const loadMatrixData = async () => {
              setIsLoading(true);
              const dbMatrix = await retrieveDecisionMatrix();
              if (dbMatrix) setMatrixData(dbMatrix);
              setIsLoading(false);
            };
            loadMatrixData();
          }}
        >
          Reload Matrix
        </Button>
        <Button onClick={runCalculation} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Run Calculation'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DecisionMatrix;
