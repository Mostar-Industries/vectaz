
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MatrixTable from "./MatrixTable";
import CalculationResults from "./CalculationResults";
import { retrieveDecisionMatrix, storeDecisionMatrix, runMatrixCalculation, MatrixData } from "@/services/matrixService";

const DecisionMatrix: React.FC = () => {
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  // Load matrix data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Try to load from Supabase first
      const dbMatrix = await retrieveDecisionMatrix();
      
      if (dbMatrix && dbMatrix.rows.length > 0) {
        setMatrixData(dbMatrix);
      } else {
        // If not in database, load from local data
        const { loadDecisionMatrix } = await import("@/utils/decisionMatrixParser");
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
    
    loadData();
    
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
  const handleCalculation = async () => {
    if (!matrixData) return;
    
    setIsProcessing(true);
    
    try {
      const result = await runMatrixCalculation(matrixData);
      if (result) {
        setCalculationResult(result);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Reload the matrix data
  const handleReload = async () => {
    setIsLoading(true);
    const dbMatrix = await retrieveDecisionMatrix();
    
    if (dbMatrix && dbMatrix.rows.length > 0) {
      setMatrixData(dbMatrix);
      toast({
        title: "Success",
        description: "Matrix data reloaded successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "No matrix data available",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
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
        <MatrixTable 
          rows={matrixData?.rows || []} 
          columnCount={matrixData?.columnCount || 0} 
        />
        
        <CalculationResults calculationResult={calculationResult} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReload}>
          Reload Matrix
        </Button>
        <Button onClick={handleCalculation} disabled={isProcessing}>
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
